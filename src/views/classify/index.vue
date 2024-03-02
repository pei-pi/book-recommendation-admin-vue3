<template>
  <div>
    <input type="file" @change="handleFileChange" />
    <button @click="uploadImage">上传图片</button>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  methods: {
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
      console.log(this.selectedFile)
    },
    uploadImage() {
      const formData = new FormData();
      formData.append("image", this.selectedFile);

      // 发送请求
      request({
        url: "/upload/image",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((response) => {
            console.log(response)
          // 处理响应
        })
        .catch((error) => {
          // 处理错误
          console.log(error)
        });
    },
  },
  data() {
    return {
      selectedFile: null,
    };
  },
};
</script>
