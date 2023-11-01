<script>
import DxButton from "devextreme-vue/button";
import DxSelectBox from "devextreme-vue/select-box";
import DlgImportFile from "./components/DlgImportFile.vue";

// import DxToolbar, { DxItem } from "devextreme-vue/toolbar";

import { read, utils } from "xlsx";

/** переменная для чтения файлов */
const reader = new FileReader();
/** функция производит чтение загруженных файлов */
async function readFile(file) {
  return new Promise((resolve, reject) => {
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (event) => {
      reject(event.target.error);
    };
    reader.readAsArrayBuffer(file); // можно изменить это, если нужно прочитать файл, например. как текст: readAsText(file)
  });
}

export default {
  name: "App",
  components: { DxButton, DxSelectBox, DlgImportFile },
  data() {
    return {
      DlgImportFile: false,
      periods: [
        { name: "Месяц", period: 30 },
        { name: "Квартал", period: 120 },
        { name: "Год", period: 365 },
        { name: "2 Года", period: 730 },
        { name: "3 Года", period: 1095 },
      ],
      period: 30,
      tiragesAmount: 5,

      lotos: [
        { name: "Забава", type: 1 },
        { name: "4 из 20", type: 2 },
        { name: "7 из 49", type: 3 },
        { name: "6 из 45", type: 4 },
        { name: "Большое спортлото", type: 5 },
        { name: "Рапидо", type: 6 },
      ],
      lotoType: 1,

      zabavaText: null,

      of4_in20_1: null,
      of4_in20_2: null,
      rare_numbers_1: null,
      rare_numbers_2: null,

      of7_in_49Text: null,
      rare_numbers_of7_in_49: null,

      of6_in_45Text: null,
      rare_numbers_of6_in_45: null,
    };
  },

  methods: {
    onValueChangedType(e) {
      if (e.event !== undefined) {
        if (e.value === 4) {
          this.tiragesAmount = 7;
        } else {
          this.tiragesAmount = 5;
        }
      }
    },
    async onPbImport(files) {
      let fileData = await readFile(files[0]);
      let resultArr = [];
      let block_1 = [];
      let block_2 = [];

      const workbook = read(fileData);

      const sheet_name_list = workbook.SheetNames;
      let ws = workbook.Sheets[sheet_name_list[0]];
      let data = utils.sheet_to_json(ws, { header: "A", raw: false });

      switch (this.lotoType) {
        case 1:
          data.forEach((row, index) => {
            if (index >= 1) {
              resultArr.push(Number(row.C));
              resultArr.push(Number(row.D));
              resultArr.push(Number(row.E));
              resultArr.push(Number(row.F));
              resultArr.push(Number(row.G));
              resultArr.push(Number(row.H));
              resultArr.push(Number(row.I));
              resultArr.push(Number(row.J));
              resultArr.push(Number(row.K));
              resultArr.push(Number(row.L));
              resultArr.push(Number(row.M));
              resultArr.push(Number(row.N));
            }
          });
          this.zabava(resultArr);
          break;

        case 2:
          data.forEach((row, index) => {
            if (index >= 1 && index < this.period * this.tiragesAmount) {
              block_1.push(Number(row.C));
              block_1.push(Number(row.D));
              block_1.push(Number(row.E));
              block_1.push(Number(row.F));
              block_2.push(Number(row.G));
              block_2.push(Number(row.H));
              block_2.push(Number(row.I));
              block_2.push(Number(row.J));
            }
          });
          this.of4_in_20(block_1, block_2);
          break;

        case 3:
          data.forEach((row, index) => {
            if (index >= 1 && index < this.period * this.tiragesAmount) {
              resultArr.push(Number(row.C));
              resultArr.push(Number(row.D));
              resultArr.push(Number(row.E));
              resultArr.push(Number(row.F));
              resultArr.push(Number(row.G));
              resultArr.push(Number(row.H));
              resultArr.push(Number(row.I));
            }
          });
          this.of7_in_49(resultArr);
          break;

        case 4:
          data.forEach((row, index) => {
            if (index >= 1 && index < this.period * this.tiragesAmount) {
              resultArr.push(Number(row.C));
              resultArr.push(Number(row.D));
              resultArr.push(Number(row.E));
              resultArr.push(Number(row.F));
              resultArr.push(Number(row.G));
              resultArr.push(Number(row.H));
            }
          });
          this.of6_in_45(resultArr);
          break;

        default:
          break;
      }

      // console.log(data);
    },
    zabava(data) {
      const countItems = {}; // здесь будет храниться промежуточный результат

      // {1: 1, 3: 2, 4: 2, 7: 1, 15: 1, 19: 2}
      // 1 встречается в тексте 1 раз, 2 встречается 2 раза, 4 встречается 2 раза и так далее
      for (const item of data) {
        // если элемент уже был, то прибавляем 1, если нет - устанавливаем 1
        countItems[item] = countItems[item] ? countItems[item] + 1 : 1;
      }

      let summ = 0;
      for (let count of Object.values(countItems)) {
        summ += count;
      }

      // обрабатываем ключи объекта, отфильтровываем все, что меньше 1
      const result = Object.keys(countItems).filter(
        (item) => countItems[item] >= summ / 24 + 1
      );
      this.zabavaText = result;
    },

    of4_in_20(block_1, block_2) {
      const countItems_1 = {}; // здесь будет храниться промежуточный результат
      const countItems_2 = {}; // здесь будет храниться промежуточный результат

      // получаем объект в котором ключ - это элемент массива, а значение - сколько раз встречается элемент в списке
      // например так будет выглядеть этот объект после цикла:
      // {1: 1, 3: 2, 4: 2, 7: 1, 15: 1, 19: 2}
      // 1 встречается в тексте 1 раз, 2 встречается 2 раза, 4 встречается 2 раза и так далее
      for (const item of block_1) {
        // если элемент уже был, то прибавляем 1, если нет - устанавливаем 1
        countItems_1[item] = countItems_1[item] ? countItems_1[item] + 1 : 1;
      }

      const numbersArr_1 = Object.values(countItems_1).sort();

      const summ_1 = numbersArr_1.reduce((a, b) => {
        return a + b;
      }, 0);
      const summRound_1 = Math.round(summ_1 / 20);
      const koef_1 = () => {
        switch (this.period) {
          case 30:
            return Math.round(summRound_1 / 100);
            break;
          case 120:
            return Math.round(summRound_1 / 100) + 3;
            break;
          case 365:
            return Math.round(summRound_1 / 100) + 6;
            break;
          case 730:
            return Math.round(summRound_1 / 100) + 6;
            break;
          case 1095:
            return Math.round(summRound_1 / 100) + 9;
            break;

          default:
            break;
        }
      };

      // обрабатываем ключи объекта, отфильтровываем все, что меньше 1
      const result_1 = Object.keys(countItems_1).filter(
        (item) => countItems_1[item] > summRound_1 + koef_1()
      );
      this.of4_in20_1 = result_1;

      const rare_numbers_1 = Object.keys(countItems_1).filter(
        (item) => countItems_1[item] < summRound_1 - koef_1() - 3
      );
      this.rare_numbers_1 = rare_numbers_1;

      for (const item of block_2) {
        // если элемент уже был, то прибавляем 1, если нет - устанавливаем 1
        countItems_2[item] = countItems_2[item] ? countItems_2[item] + 1 : 1;
      }

      const numbersArr_2 = Object.values(countItems_2).sort();

      const summ_2 = numbersArr_2.reduce((a, b) => {
        return a + b;
      }, 0);
      const summRound_2 = Math.round(summ_2 / 20);
      const koef_2 = () => {
        switch (this.period) {
          case 30:
            return Math.round(summRound_2 / 100);
            break;
          case 120:
            return Math.round(summRound_2 / 100) + 3;
            break;
          case 365:
            return Math.round(summRound_2 / 100) + 6;
            break;
          case 730:
            return Math.round(summRound_2 / 100) + 6;
            break;
          case 1095:
            return Math.round(summRound_2 / 100) + 9;
            break;

          default:
            break;
        }
      };
      // обрабатываем ключи объекта, отфильтровываем все, что меньше 1
      const result_2 = Object.keys(countItems_2).filter(
        (item) => countItems_2[item] > summRound_2 + koef_2()
      );
      this.of4_in20_2 = result_2;

      const rare_numbers_2 = Object.keys(countItems_2).filter(
        (item) => countItems_2[item] < summRound_2 - koef_2() - 3
      );
      this.rare_numbers_2 = rare_numbers_2;
    },

    of7_in_49(data) {
      const countItems = {}; // здесь будет храниться промежуточный результат

      // {1: 1, 3: 2, 4: 2, 7: 1, 15: 1, 19: 2}
      // 1 встречается в тексте 1 раз, 2 встречается 2 раза, 4 встречается 2 раза и так далее
      for (const item of data) {
        // если элемент уже был, то прибавляем 1, если нет - устанавливаем 1
        countItems[item] = countItems[item] ? countItems[item] + 1 : 1;
      }

      let summ = 0;
      for (let count of Object.values(countItems)) {
        summ += count;
      }
      const numbersArr_1 = Object.values(countItems).sort();

      const summ_1 = numbersArr_1.reduce((a, b) => {
        return a + b;
      }, 0);
      const summRound_1 = Math.round(summ_1 / 49);
      const koef = () => {
        switch (this.period) {
          case 30:
            return Math.round(summRound_1 / 100) + 5;
            break;
          case 120:
            return Math.round(summRound_1 / 100) * 8;
            break;
          case 365:
            return Math.round(summRound_1 / 100) * 6;
            break;
          case 730:
            return Math.round(summRound_1 / 100) * 5;
            break;
          case 1095:
            return Math.round(summRound_1 / 100) * 3;
            break;

          default:
            break;
        }
      };

      // обрабатываем ключи объекта, отфильтровываем все, что меньше 1
      const result = Object.keys(countItems).filter(
        (item) => countItems[item] >= summRound_1 + koef()
      );
      this.of7_in_49Text = result;

      const rare_numbers_1 = Object.keys(countItems).filter(
        (item) => countItems[item] <= summRound_1 - koef() - 1
      );
      this.rare_numbers_of7_in_49 = rare_numbers_1;
    },

    of6_in_45(data) {
      const countItems = {}; // здесь будет храниться промежуточный результат

      // {1: 1, 3: 2, 4: 2, 7: 1, 15: 1, 19: 2}
      // 1 встречается в тексте 1 раз, 2 встречается 2 раза, 4 встречается 2 раза и так далее
      for (const item of data) {
        // если элемент уже был, то прибавляем 1, если нет - устанавливаем 1
        countItems[item] = countItems[item] ? countItems[item] + 1 : 1;
      }

      let summ = 0;
      for (let count of Object.values(countItems)) {
        summ += count;
      }
      const numbersArr_1 = Object.values(countItems).sort();

      const summ_1 = numbersArr_1.reduce((a, b) => {
        return a + b;
      }, 0);
      const summRound_1 = Math.round(summ_1 / 45);
      const koef = () => {
        switch (this.period) {
          case 30:
            return Math.round(summRound_1 / 100) + 5;
            break;
          case 120:
            return Math.round(summRound_1 / 100) * 8;
            break;
          case 365:
            return Math.round(summRound_1 / 100) * 6;
            break;
          case 730:
            return Math.round(summRound_1 / 100) * 5;
            break;
          case 1095:
            return Math.round(summRound_1 / 100) * 3;
            break;

          default:
            break;
        }
      };

      // обрабатываем ключи объекта, отфильтровываем все, что меньше 1
      const result = Object.keys(countItems).filter(
        (item) => countItems[item] >= summRound_1 + koef()
      );
      this.of6_in_45Text = result;

      const rare_numbers_1 = Object.keys(countItems).filter(
        (item) => countItems[item] <= summRound_1 - koef() - 1
      );
      this.rare_numbers_of6_in_45 = rare_numbers_1;
    },
  },
};
</script>

<template>
  <div>
    <DlgImportFile
      :DlgImportFile="DlgImportFile"
      :onOkClick="onPbImport"
      :closeDlgAddRow="
        () => {
          this.DlgImportFile = false;
        }
      "
    />
    <div style="margin: 20px">
      <DxSelectBox
        v-model:value="period"
        hint="Выбрать показатель"
        width="200"
        :data-source="periods"
        displayExpr="name"
        valueExpr="period"
      />
    </div>
    <div style="margin: 20px">
      <DxSelectBox
        v-model:value="lotoType"
        hint="Выбрать показатель"
        width="200"
        :data-source="lotos"
        displayExpr="name"
        valueExpr="type"
        @value-changed="onValueChangedType"
      />
    </div>
    <div style="margin: 20px">
      <DxButton
        icon="importselected"
        text="Импорт"
        @click="
          () => {
            this.DlgImportFile = true;
          }
        "
        hint="Импортировать файл xls"
      />
    </div>
    <div class="result">Результат: {{ lotos[lotoType - 1].name }}</div>
    <div v-if="lotoType === 1" class="items-container">
      <span v-for="item in zabavaText" :key="item" class="result-text">
        {{ item }}
      </span>
    </div>
    <div v-else-if="lotoType === 2">
      <div class="items-container">
        Поле 1
        <span v-for="item in of4_in20_1" :key="item" class="result-text">
          {{ item }}
        </span>
      </div>
      <div class="items-container">
        Поле 2
        <span v-for="item in of4_in20_2" :key="item" class="result-text">
          {{ item }}
        </span>
      </div>
      <div class="items-container">
        Редкие 1
        <span v-for="item in rare_numbers_1" :key="item" class="result-text">
          {{ item }}
        </span>
      </div>
      <div class="items-container">
        Редкие 2
        <span v-for="item in rare_numbers_2" :key="item" class="result-text">
          {{ item }}
        </span>
      </div>
    </div>

    <div v-else-if="lotoType === 3">
      <div class="items-container">
        частые
        <span v-for="item in of7_in_49Text" :key="item" class="result-text">
          {{ item }}
        </span>
      </div>
      <div class="items-container">
        Редкие
        <span
          v-for="item in rare_numbers_of7_in_49"
          :key="item"
          class="result-text"
        >
          {{ item }}
        </span>
      </div>
    </div>

    <div v-else-if="lotoType === 4">
      <div class="items-container">
        частые
        <span v-for="item in of6_in_45Text" :key="item" class="result-text">
          {{ item }}
        </span>
      </div>
      <div class="items-container">
        Редкие
        <span
          v-for="item in rare_numbers_of6_in_45"
          :key="item"
          class="result-text"
        >
          {{ item }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result {
  margin: 10px;
  color: coral;
  font-weight: bold;
  font-size: 26px;
}

.result-text {
  padding: 4px;
  margin: 12px;
  color: black;
  font-weight: bold;
  background-color: #ddd;
  font-size: 22px;
}
.items-container {
  display: flex;
  flex-wrap: wrap;
}
</style>
