<template>
    <section class="course__header-area duplicated" :class="{ 'd-none' : !showPopup }">
        <div class="container">
            <div class="row align-items-end">
                <div class="col-lg-8">
                    <div class="course-header-wrap">
                        <h1 class="title">{{course.title}}</h1>
                        <div class="rating-row">
                            <span class="course-badge best-seller">Beginner</span>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <span class="d-inline-block average-rating">0</span>&nbsp;<span>(0 Ratings)</span>
                            <span class="enrolled-num">
                                - 0 Students enrolled
                            </span>
                        </div>
                        <div class="created-row">
                            <span class="created-by">
                                Created by <a href="http://demo.academy-lms.com/default/home/instructor_page/1">John Doe</a>
                            </span>
                            <span class="last-updated-date">Last updated Sat, 06-Jul-2019</span>
                            <span class="comment"><i class="fas fa-comment"></i>English</span>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="ml-3">
                        <div class="card shadow-sm" style="position: fixed; margin-top: 0; width: 350px; top: 10px">
                            <div class="card-body p-0">
                                <div v-if="enrolled" class="p-1 px-3 bg-info w-100">
                                    <p class="mb-0 text-white">
                                        <small><fa icon="info-circle" /> You purchased this course on {{ enrolled_at.pivot.created_at | moment('MMM. D, YYYY') }} </small>
                                    </p>
                                </div>
                                <div class="p-4">
                                    <div class="pricing">
                                        <h2 class="font-weight-500">
                                        <div class="d-flex">
                                            <template v-if="!course.free_course">
                                                <div>
                                                    <client-only>
                                                        <span class="font-weight-bold" v-if="!course.has_discount">₱{{course.price | numeral}}</span>
                                                        <span class="font-weight-bold" v-else>₱{{course.discount | numeral}}</span>
                                                    </client-only>
                                                </div>
                                                <div v-if="course.has_discount" class="ml-2">
                                                    <client-only>
                                                        <strike class="text-muted small"><small>₱{{course.price | separator }}</small></strike>
                                                        <span class="text-danger small"><small>{{percentage}}% off</small></span>
                                                    </client-only>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <h2 v-if="!enrolled" class="font-weight-bold mb-0">Free Course </h2> 
                                            </template>
                                        </div>
                                        </h2>
                                    </div>
                                    <add-to-cart :lessonId="lessonId" :enrolled="enrolled" :course_id="course.id" :free_course="course.free_course == 1 ? true : false" :price="course.has_discount == true ? course.discount : course.price" :courseInCart="courseInCart" :slug="course.slug"></add-to-cart>
                                    <div class="mt-3">
                                        <p class="font-weight-bold mb-2 text-dark">Includes:</p>
                                        <ul class="list-unstyled small" style="color: #505763;">
                                            <li v-for="item in items" :key="item.id" class="mb-1">
                                                <fa :icon="item.icon" fixed-width /> &nbsp; {{item.value}} 
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="mt-3 text-center border-top">
                                        <button class="btn btn-link text-capitalize pb-0" @click="openShareButtonsModal">
                                            <fa icon="share-square" fixed-width /> Share
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <transition name="fade" mode="out-in">
            <share-buttons v-if="showShareButtons" @close="closeShareButtonsModal" :course="course"></share-buttons>
        </transition>

    </section>
</template>

<script>
    let myBody = null

    import AddToCart from './add-to-cart'
    
    import ShareButtons from './share'

    export default {
        
        name: 'PopupNavbar',

        components: {
            AddToCart, ShareButtons
        },

        props: ['course', 'items', 'percentage', 'enrolled', 'enrolled_at', 'lessonId'],

        data: function () {
            return {
                showPopup: false,
                lastScrollPosition: 0,

                showShareButtons: false,
            }
        },

        mounted: function () {
            myBody = document.getElementsByTagName('body')[0]
            window.addEventListener('scroll', this.onScroll)
        },

        beforeDestroy: function () {
            window.removeEventListener('scroll', this.onScroll)
        },

        methods: {
            onScroll: function () {
                // Get the current scroll position
                const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop

                // Because of momentum scrolling on mobiles, we shouldn't continue if it is less than zero
                if (currentScrollPosition < 0) {
                    return
                }

                // Stop executing this function if the difference between current scroll position and last scroll position is less than some offset
                // if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 100) {
                //     return
                // }
                this.showPopup = currentScrollPosition >= 350
                this.lastScrollPosition = currentScrollPosition
            },

            // Open share buttons modal
            openShareButtonsModal: function() {
                this.showShareButtons = true

                // Add class to body
                myBody.classList.toggle('modal-open')
            },

            closeShareButtonsModal: function () {
                this.showShareButtons = false
                myBody.classList.remove('modal-open')
            },
        },

    }
</script>

<style lang="scss" scoped>
    .navbar--hidden {
        display: none;
    }
</style>