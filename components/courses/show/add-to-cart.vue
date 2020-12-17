<template>
    <div>
        <div>
            <template v-if="!free_course">
                <template v-if="user">
                    <div>
                        <button class="btn btn-danger btn-lg text-capitalize btn-block border rounded" :class="{ 'btn-loading' : busy }" :disabled="busy" @click="addToCart">
                            <span v-if="!addedToCart">Add to cart</span>
                            <span v-else>Added to Cart</span>
                        </button>
                        <button class="btn btn-neutral btn-danger btn-lg text-capitalize btn-block text-dark rounded border">
                            Buy Now
                        </button>
                    </div>
                </template>
                <template v-else>
                    <div>
                        <button class="btn btn-danger btn-lg text-capitalize btn-block border rounded" @click="openLoginModal">
                            Add to cart
                        </button>
                        <button class="btn btn-neutral btn-danger btn-lg text-capitalize btn-block text-dark rounded border" @click="openLoginModal">
                            Buy Now
                        </button>
                    </div>
                </template>
            </template>
            <template v-else>
                <template v-if="!enrolled">
                    <template v-if="user">
                        <button v-if="user.id != teacher_id" class="btn btn-danger btn-lg text-capitalize btn-block rounded border" :class="{ 'btn-loading' : busy }" :disabled="busy" @click="enroll">
                            Enroll Now
                        </button>
                    </template>
                    <template v-else>
                        <button class="btn btn-danger btn-lg text-capitalize btn-block border rounded" @click="openLoginModal">
                            Enroll Now
                        </button>
                    </template>
                </template>
                <template v-else>
                    <router-link :to="{ name: 'student.courses.learn' , params: { slug: slug, lesson_id: lessonId } }" class="btn btn-primary btn-lg text-capitalize btn-block rounded border">
                        Go to course
                    </router-link> 
                </template>
            </template>
        </div>

        <!-- // Modal -->
        <transition name="fade" mode="out-in">
            <modal-login v-if="showLoginModal" @close="closeLoginModal"></modal-login>
        </transition>

    </div>
</template>

<script>
    let myBody = null

    import axios from 'axios'
    import { mapGetters } from 'vuex'
    import ModalLogin from '../../auth/modal_login'

    export default {

        components: {
            ModalLogin
        },

        name: 'AddToCart',

        props: ['course_id', 'price', 'free_course', 'enrolled', 'slug', 'teacher_id', 'lessonId'],

        data: () => ({
            showLoginModal: false,
            busy: false,
            addedToCart: false,
        }),

        computed: mapGetters({
            user: 'auth/user'
        }),

        methods: {
            // Add to cart
            async addToCart () {
                this.busy = true
                try {
                    let { data } = await axios.post('/cart/store', {
                        course_id: this.course_id,
                        price: this.price
                    })
                    this.addedToCart = data.saved
                    this.busy = false
                    this.$swal({
                        type: 'success',
                        text: data.message
                    })
                } catch (e) {
                    this.$swal({
                        type: 'error',
                        text: 'Course is already in your cart.'
                    })
                }
            },

            async enroll() {
                this.busy = true
                try {
                    let { data } = await axios.post(`/cart/subscribe/course/${this.course_id}/post`)
                    this.$router.push({ name: 'student.courses.learn', params: { slug: this.$route.params.slug, lesson_id: this.lessonId } })
                    this.busy = false
                    this.$swal({
                        type: 'success',
                        text: data.message
                    })
                } catch (e) {
                    this.busy = false
                    this.$swal({
                        type: 'error',
                        text: "Sorry, you can't enroll on your own course."
                    })
                }
            },

            openLoginModal: function () {
                this.showLoginModal = true

                // Add class to body
                myBody.classList.toggle('modal-open')
            },

            closeLoginModal: function () {
                this.showLoginModal = false
                myBody.classList.remove('modal-open')
            }
        },

        mounted: function () {
            myBody = document.getElementsByTagName('body')[0]
        },

    }
</script>

<style>

</style>