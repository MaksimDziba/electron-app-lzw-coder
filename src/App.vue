<template>
  <div class="container__app">
    <div class="container__inner">
      <div class="container__header">
        <a-typography-title :level="2"
          >Кодер методом Лемпеля-Зива-Велча</a-typography-title
        >
      </div>

      <div class="container__main">
        <div class="container__form">
          <a-form
            class="form__main"
            :model="formState"
            name="validate_other"
            layout="inline"
          >
            <a-form-item
              class="form__field-path"
              label="Путь до файла"
              name="path"
            >
              <a-input v-model:value="formState.path" />
            </a-form-item>

            <a-form-item name="upload">
              <a-upload
                :custom-request="handleActionUpload"
                :show-upload-list="false"
              >
                <a-button>
                  <template #icon><UploadOutlined /></template>
                  Выбрать файл
                </a-button>
              </a-upload>
            </a-form-item>
          </a-form>
        </div>

        <div class="container__action">
          <a-button
            class="action__btn"
            type="primary"
            shape="round"
            :disabled="disableButton"
            @click="handleCoder(formState.path)"
          >
            <template #icon>
              <DownloadOutlined />
            </template>
            Кодировать
          </a-button>

          <a-button
            class="action__btn"
            type="primary"
            shape="round"
            :disabled="disableButton"
            @click="handleDecoder(formState.path)"
          >
            <template #icon>
              <DownloadOutlined />
            </template>
            Декодировать
          </a-button>
        </div>
      </div>

      <div class="container__history">
        <a-typography-title :level="4">История</a-typography-title>

        <div class="history__box">
          <div class="history__item" v-for="item in histories">
            {{ item.date }} - {{ item.type }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  decompressFile,
  compressFile,
  formatBytes,
} from "./service/help.service";

import { FormInstance } from "ant-design-vue";
import { computed, defineComponent, reactive, ref } from "vue";

// icons
import { SaveOutlined, DownloadOutlined } from "@ant-design/icons-vue";

interface FileWithPath extends File {
  path: string;
}

export default defineComponent({
  name: "App",
  components: {
    SaveOutlined,
    DownloadOutlined,
  },
  setup() {
    const formRef = ref<FormInstance>();
    const formState = reactive({
      path: "",
    });
    let sourceFile: File | null = null;

    const histories = reactive<{ date: string; type: string }[]>([]);

    const addHistory = (type: string) => {
      const date = new Intl.DateTimeFormat("ru-RU", {
        timeZone: "Europe/Moscow",
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour12: false,
        minute: "2-digit",
        hour: "2-digit",
      }).format(new Date());

      histories.unshift({
        date,
        type,
      });
    };

    const handleActionUpload = async ({ file }: { file: FileWithPath }) => {
      if (file.path) {
        formState.path = file.path;

        sourceFile = file;
      }
    };

    const handleCoder = (path: string) => {
      const start = new Date();
      const file = sourceFile;

      if (file) {
        addHistory("Кодирование файла");
        addHistory(`Расположение файла: ${path}`);
        addHistory(`Размер исходного файла: ${formatBytes(file.size)}`);

        const callback = (size: number) => {
          addHistory(`Размер закодированного файла: ${formatBytes(size)}`);
          addHistory(
            `Степень сжатия: ${((file.size * 100) / size - 100).toFixed(2)}%`
          );

          addHistory("Кодирование файла завершено");
          const end = new Date();

          addHistory(
            `Время кодирования: ${
              (end.getTime() - start.getTime()) / 1000
            } сек.`
          );

          sourceFile = null;
          formState.path = "";
        };

        compressFile(file, callback);
      }
    };

    const handleDecoder = async (path: string) => {
      const start = new Date();
      const file = sourceFile;

      if (file) {
        addHistory("Декодирование файла");
        addHistory(`Расположение файла: ${path}`);
        addHistory(`Размер исходного файла: ${formatBytes(file.size)}`);

        const callback = (size: number) => {
          addHistory(`Размер декодированного файла: ${formatBytes(size)}`);
          addHistory(
            `Степень сжатия: ${((file.size * 100) / size - 100).toFixed(2)}%`
          );

          addHistory("Декодирование файла завершено");
          const end = new Date();

          addHistory(
            `Время декодирования: ${
              (end.getTime() - start.getTime()) / 1000
            } сек.`
          );

          sourceFile = null;
          formState.path = "";
        };

        await decompressFile(file, callback);
      }
    };

    return {
      formState,
      formRef,
      histories,
      addHistory,
      handleActionUpload,
      handleCoder,
      handleDecoder,
      disableButton: computed(() => formState.path === ""),
    };
  },
});
</script>

<style lang="sass">
@import "./assets/style.scss"
</style>
