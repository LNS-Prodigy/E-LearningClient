<template>
    <div>

        <div class="card rounded-bottom">
            <!-- // If Image exists -->
            <template v-if="form.image == ''">
                <img :src="image.image" class="card-image-top rounded-top img-fluid shadow-sm img_preview" alt="">
            </template>
            <template v-else>
                <img :src="form.imagePreview" class="card-image-top rounded-top img-fluid shadow-sm img_preview" alt="">
            </template>

            <div class="card-body p-2 text-center">
                <button type="button" class="btn btn-link btn-sm text-capitalize" data-toggle="modal" data-target="#exampleModal">
                    <fa icon="camera" fixed-width />
                    Change Thumbnail
                </button>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Change Thumbnail</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form @submit.prevent="change">
                        <div class="modal-body">
                            <alert-error :form="form" message="Can't upload thumbnail."></alert-error>
                            <input class="mt-3" type="file" name="image" accept="image/*" @change="selectFile">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <v-button :loading="form.busy">
                                Change Image
                            </v-button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        

        

        


    </div>
</template>

<script>
    import axios from 'axios'
    import Form from 'vform'

    if (process.client) {
        let objectToFormData = document.createElement('script')
        objectToFormData.setAttribute('src', "https://cdn.rawgit.com/cretueusebiu/412715093d6e8980e7b176e9de663d97/raw/aea128d8d15d5f9f2d87892fb7d18b5f6953e952/objectToFormData.js")
        document.head.appendChild(objectToFormData)
    }

    export default {

        data: () => ({
            image: [],
            progress: 0,
            form: new Form({
                image: '',
                imagePreview: '',
            }),
            error: {}
        }),

        created() {
            this.getImage()
        },

        methods: {
            selectFile(e) {
                const file = e.target.files[0]
                this.form.image = file
                this.form.imagePreview = URL.createObjectURL(file)
            },

            async change() {
                let _this = this
                try {
                    const { data } = await this.form.submit('post', `/instructor/courses/${this.image.id}/updateImage`, {
                        transformRequest: [function (data, headers) {
                            return objectToFormData(data)
                        }],
                    })
                    this.$swal({
                        type: 'success',
                        text: data.message
                    })
                } catch (e) {
                    return
                }
            },
            
            getImage: function () {
                axios.get(`/instructor/courses/${this.$route.params.slug}/editImage`)
                .then((res) => {
                    this.image = res.data.image
                }).catch((err) => {
                })
            }
        }

    }

</script>

<style scoped>
    .img_preview {
        height: 135px;
        width: 240px;
        object-fit: cover;
    }
    .card {
        width: 240px;
    }
</style>