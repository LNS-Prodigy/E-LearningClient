<template>
    <div>
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal with-transitions fade show" tabindex="-1" role="dialog" style="display: block;">
                    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div class="modal-content">

                            <div class="modal-body">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="$emit('close')">
                                    <span aria-hidden="true">&times;</span>
                                </button>

                                <!-- // Modal Data Content -->
                                    <div class="row justify-content-center mt-5 mb-5">
                                        <div class="col-lg-8">

                                            <form @submit.prevent="save" @keydown="form.onKeydown($event)">
                                                <div class="text-center">
                                                    <h4 class="font-weight-300">
                                                        How would you rate this course?
                                                    </h4>
                                                    <div class="rating mt-4 mb-3">
                                                        <h6 class="font-weight-600">{{selectedRating}}</h6>
                                                        <div @mouseleave="showCurrentRating(0)" style="display:inline-block;">
                                                            <star-rating :star-size="30" inactive-color="#fff" :show-rating="false" @current-rating="showCurrentRating" @rating-selected="setCurrentSelectedRating" :increment="0.5" v-model="form.rating" :border-width="3" :rounded-corners="true" :star-points="[23,2, 14,17, 0,19, 10,34, 7,50, 23,43, 38,50, 36,34, 46,19, 31,17]" @click="toggleShowComments"></star-rating>
                                                        </div>
                                                        <div style="margin-top:10px;font-weight:bold;"></div>
                                                    </div>
                                                    <div class="text-area">
                                                        <div class="form-group">
                                                            <textarea name="comments" id="comments" v-model="form.comments" :class="{ 'is-invalid' : form.errors.has('comments') }" cols="30" rows="6" class="form-control rounded" placeholder="Tell us about what your own personal experience taking this course. Was it a good match for you?"></textarea>
                                                            <has-error :form="form" field="comments"></has-error>
                                                        </div>
                                                    </div>
                                                    <div class="text-center">
                                                        <v-button :loading="form.busy" class="text-capitalize">Save and Continue</v-button>
                                                    </div>
                                                </div>
                                            </form>

                                        </div>
                                    </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Form from 'vform'
    import StarRating from 'vue-star-rating'

    export default {

        components: {
            StarRating
        },

        props: ['data', 'index'],

        data: function () {
            return {
                form: new Form({
                    teacher_id: '',
                    course_id: '',
                    rating: 0,
                    comments: ''
                }),

                currentSelectedRating: 'Select Rating',
                selectedRating: "Select Rating",

                showComments: false
            }
        },

        methods: {
            async save() {
                try {
                    this.form.course_id = this.data.id
                    this.form.teacher_id = this.data.teacher_id

                    let { data } = await this.form.post(`/student/account/my-courses/rating/save`)

                    this.$swal({
                        toast: true,
                        position: 'bottom-end',
                        timer: 5000,
                        showConfirmButton: false,
                        type: 'success',
                        text: data.message
                    })

                    var ratingData = {
                        index: this.index,
                        id: data.id,
                        user_id: data.user_id,
                        course_id: data.course_id,
                        teacher_id: data.teacher_id,
                        rating: data.rating,
                        comments: data.comments,
                        created_at: data.created_at,
                        updated_at: data.updated_at
                    }

                    // Close Modal
                    this.$emit('close')
                    this.$emit('clicked', ratingData)
                } catch (e) {
                    return
                }
            },

            showCurrentRating: function(rating) {
                this.selectedRating = (rating === 0) ? this.currentSelectedRating : "Click to select " + rating + " stars"
            },

            setCurrentSelectedRating: function(rating) {
                this.currentSelectedRating = "You have Selected: " + rating + " stars";
            },

            toggleShowComments: function () {
                this.showComments = !this.showComments
            }

        }

    }
</script>

<style>

</style>
