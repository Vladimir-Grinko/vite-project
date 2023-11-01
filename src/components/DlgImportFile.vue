// попап добавления файла
<template>
  <DxPopup
    :width="430"
    :height="500"
    :show-title="false"
    :show-close-button="false"
    :drag-enabled="true"
    :hide-on-outside-click="false"
    :visible="DlgImportFile"
  >
    <DxToolbarItem
      :visible="files.length > 0"
      widget="dxButton"
      toolbar="bottom"
      location="before"
      :options="deleteButtonOptions"
    />
    <DxToolbarItem
      :visible="files.length > 0"
      widget="dxButton"
      toolbar="bottom"
      location="after"
      :options="okButtonOptions"
    />
    <DxToolbarItem
      widget="dxButton"
      toolbar="bottom"
      location="after"
      :options="cancelButtonOptions"
    />
    <div class="info-container">
      <div>
        <DxFileUploader
          select-button-text="Выбрать файл"
          labelText=""
          :multiple="false"
          upload-mode="instantly"
          @initialized="saveInstance"
          :onValue-changed="fileChanged"
          :upload-file="uploadFile"
        />
      </div>
    </div>
  </DxPopup>
</template>

<script>
import { DxPopup, DxToolbarItem } from "devextreme-vue/popup";

import { DxFileUploader } from "devextreme-vue/file-uploader";

export default {
  name: "DlgImportFile",
  props: {
    DlgImportFile: Boolean,
    closeDlgAddRow: Function,
    onOkClick: Function,
  },
  components: {
    DxPopup,
    DxToolbarItem,
    DxFileUploader,
  },
  data() {
    return {
      instance: null,
      files: [],
      okButtonOptions: {
        text: "OK",
        onClick: () => {
          this.onOkClick(this.files);
          this.closeDlgAddRow();
          this.resetDownload();
        },
      },
      cancelButtonOptions: {
        text: "Отмена",
        onClick: () => {
          this.closeDlgAddRow();
          this.resetDownload();
        },
      },
      deleteButtonOptions: {
        icon: "trash",
        hint: "Удалить загруженный файл",
        onClick: () => {
          this.resetDownload();
        },
      },
    };
  },
  methods: {
    saveInstance(e) {
      this.instance = e.component;
    },
    resetDownload() {
      this.instance.reset();
    },
    fileChanged(e) {
      // let resultArr = [];
      // e.value.forEach((file) => {
      //   if (file.name === this.getNameFile()) {
      //     let findResArr = resultArr.find((item) => item.name === file.name);
      //     if (findResArr === undefined) {
      //       resultArr.push(file);
      //     } else {
      //       this.showDlgInfo({
      //         widthDlgInfo: 250,
      //         heightDlgInfo: 200,
      //         dlgText: "Данный файл уже загружен.",
      //       });
      //       this.instance.removeFile(file);
      //     }
      //   } else {
      //     this.showDlgInfo({
      //       widthDlgInfo: 250,
      //       heightDlgInfo: 200,
      //       dlgText: "Данный файл отсутствует в указанном списке.",
      //     });
      //     this.instance.removeFile(file);
      //   }
      // });

      this.files = e.value;
    },
    uploadFile(file, progressCallback) {
      progressCallback(100);
      progressCallback(200);
    },
  },
};
</script>

<style scoped lang="scss">
.info-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.info {
  padding: 10px 0 0;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}
.message {
  // margin-top: auto;
  display: flex;
  flex-direction: column;
  border: 1px solid #dddddd;
  border-radius: 4px;
}
.message span {
  padding: 5px 0 0;
  align-self: center;
  font-size: 15px;
  font-weight: 400;
}

.buttons-container {
  display: flex;
}
</style>
