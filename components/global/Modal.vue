<template>
    <div>
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal with-transitions fade show" tabindex="-1" role="dialog" style="display: block;">
                    <div class="modal-dialog" :class="{ 'modal-sm' : modalSm }" role="document">
                        <div class="modal-content">
                            
                            <!-- // Modal Header -->
                            <div v-if="header" class="modal-header">
                                <slot name="header" />
                            </div>

                            <!-- // Modal Data Content -->
                            <form @submit.prevent="form_action" >
                                <slot name="form" />
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Modal',

        props: {
            header: { type: String, default: null },
            form_action: { type: Function, default: null },
            form_event: { default: null },
            modalSm: { type: Boolean, default: false }
        },
    
    }
</script>
    
<style scoped>
    .modal {
        z-index: 10001;
    }
</style>