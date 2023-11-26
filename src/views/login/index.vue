<template>
    <div class="absolute w-1/3 l-50% t-50% transform -translate-x-1/2 -translate-y-1/2">
        <va-form ref="myForm" stateful class="mb-2 flex flex-col gap-4">
            <va-input class="h-16" b-red label="用户名" />
            <va-value v-slot="isPasswordVisible" :default-value="false">
                <va-input class="h-16" v-model="password" :type="isPasswordVisible.value ? 'text' : 'password'" label="密码"
                    @click-append-inner="isPasswordVisible.value = !isPasswordVisible.value">
                    <template #appendInner>
                        <va-icon :name="isPasswordVisible.value ? 'visibility_off' : 'visibility'" size="small"
                            color="primary" />
                    </template>
                </va-input>
            </va-value>
            <va-button class="mt-2">Login</va-button>
        </va-form>

    </div>
</template >
<script setup>
import { useForm } from 'vuestic-ui'

const { formData } = useForm('myForm')
</script>
