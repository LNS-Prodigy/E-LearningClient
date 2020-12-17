<template>
    <div>
        <div>
            <client-only>
                <offline-alert/>
            </client-only>

            <!-- // jumbotron -->
            <div class="jumbotron mb-0 bg-dark">
                <section class="">
                    <div class="container">
                        <div class="row">
                            <!-- Course Overview -->
                            <div class="col-lg-8 h-100">
                                <div style="height: 220px;">
                                    <h1 class="text-white font-weight-500">{{course.title}}</h1>
                                    <h4 class="text-white font-weight-300 mt-2">{{course.excerpt}}</h4>
                                    <div class="rating-row">
                                        <span class="course-badge best-seller mr-2">{{course.level}}</span>
                                        <star-rating :star-size="15" :inline="true" :read-only="true" :show-rating="false" :rating="avgRating" :increment="0.5" :star-points="[23,2, 14,17, 0,19, 10,34, 7,50, 23,43, 38,50, 36,34, 46,19, 31,17]"></star-rating>
                                        <small>
                                            <span class="d-inline-block average-rating text-white mr-2">{{ avgRating }}</span><span class="text-white mr-2">({{ course.ratings_count }} Ratings)</span>
                                            <span class="enrolled-num text-white">
                                                {{ students }} Students enrolled
                                            </span>
                                        </small>
                                    </div>
                                    <div class="created-row mt-2">
                                        <small>
                                            <span class="created-by text-white">
                                                Created by
                                                <a href="#course-instructor" :to="{ name: 'course.instructor.show', params: { username: instructor.username } }">
                                                    {{instructor.name}}
                                                </a>
                                            </span>
                                            <span class="last-updated-date text-white ml-2">Last updated {{course.updated_at | moment(' L')}}</span>
                                            <span class="comment text-white"><fa icon="language" class="mr-1 ml-2" />English</span>
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- // Popup -->
            <section class="course__header-area duplicated" :class="{ 'd-none' : !showPopup }">
                <div class="container">
                    <div class="row align-items-end">
                        <div class="col-lg-8">
                            <div class="course-header-wrap">
                                <h1 class="title">{{course.title}}</h1>
                                <div class="rating-row">
                                    <span class="course-badge best-seller">{{ course.level }}</span>
                                    <star-rating :rating="avgRating" :inline="true" :read-only="true" :show-rating="false" :increment="0.5" :star-size="17"></star-rating>
                                    <span class="d-inline-block average-rating">{{ avgRating }}</span>&nbsp;<span>({{ course.ratings_count }} Ratings)</span>
                                    <span class="enrolled-num">
                                    - {{ students }} Students enrolled
                                    </span>
                                </div>
                                <div class="created-row">
                                    <span class="created-by">
                                        Created by <a href="http://demo.academy-lms.com/default/home/instructor_page/1">
                                            {{ instructor.name }}
                                        </a>
                                    </span>
                                    <span class="last-updated-date">Last updated {{ course.updated_at | moment("dddd, MMMM Do YYYY") }}</span>
                                    <span class="comment"><i class="fas fa-comment"></i>{{ course.language }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="ml-3">
                                <div class="card shadow-sm" style="position: fixed; margin-top: 0; width: 350px; top: 10px">
                                    <div class="card-body p-0">
                                        <div v-if="enrolled_course" class="p-1 px-3 bg-info w-100">
                                            <p class="mb-0 text-white">
                                                <small><fa icon="info-circle" fxied-width /> &nbsp; You purchased this course on {{ enrolled_at.pivot.created_at | moment('MMM. D, YYYY') }} </small>

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
                                                        <h2 class="font-weight-bold mb-0" v-if="!enrolled_course">Free Course </h2>
                                                    </template>
                                                </div>
                                                </h2>
                                            </div>
                                            <div>
                                                <!-- // Add to Cart  -->
                                                <template v-if="!course.free_course">
                                                    <template v-if="user">
                                                        <div>
                                                            <button class="btn btn-danger btn-lg text-capitalize btn-block border rounded" :class="{ 'btn-loading' : busy }" :disabled="busy">
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
                                                    <template v-if="!enrolled_course">
                                                        <template v-if="user">
                                                            <button class="btn btn-danger btn-lg text-capitalize btn-block rounded border" :class="{ 'btn-loading' : busy }" :disabled="busy" @click="enroll">
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
                                                        <router-link :to="{ name: 'student.courses.learn' , params: { slug: course.slug, lesson_id: course.first_lesson.id } }" class="btn btn-primary btn-lg text-capitalize btn-block rounded border">
                                                            Go to course
                                                        </router-link>
                                                    </template>
                                                </template>
                                            </div>
                                            <div class="mt-3">
                                                <p class="font-weight-bold mb-2 text-dark">Includes:</p>
                                                <ul class="list-unstyled small" style="color: #505763;">
                                                    <li v-for="item in includes" :key="item.id" class="mb-1">
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

            <!-- // Main Course -->
            <section class="section-sm">
                <div class="container">
                    <div class="row">
                        <!-- // More Course Information -->
                        <div class="col-lg-8">

                            <!-- // What Will I learn? -->
                            <div class="course__outcome">
                                <div class="course__outcome--title">
                                    What will I learn?
                                </div>
                                <template v-if="!isExpandedOutcome">
                                    <ul class="course__outcome--items mt-4">
                                        <li v-for="(item, key) in course.outcomes.slice(0, 6)" :key="key">
                                            {{item.description}}
                                        </li>
                                    </ul>
                                    <div class="mt-2" v-if="course.outcomes.length > 6">
                                        <a href="#" @click.prevent="showOutcome"> <fa icon="plus" fixed-width /> &nbsp; Show More </a>
                                    </div>
                                </template>

                                <template v-else>
                                    <ul class="course__outcome--items mt-4">
                                        <li v-for="(outcome, key) in course.outcomes" :key="key">
                                            {{outcome.description}}
                                        </li>
                                    </ul>
                                    <div class="mt-2">
                                        <a href="#" @click.prevent="lessOutcome"><fa icon="minus" fixed-width /> &nbsp; Show Less</a>
                                    </div>
                                </template>
                            </div>

                            <!-- // Course content -->
                            <section-accordion :sections="sections" :lessons="lessons" :duration="duration" :countLessons="countLessons" :quizzes="quizzes" :totalLessonDuration="totalLessonDuration"></section-accordion>

                            <!-- // Course Requirements -->
                            <div class="mt-5">
                                <h4>Requirements</h4>
                                <div class="mt-4">
                                    <ul class="pl-3 text-justify">
                                        <li v-for="(item, key) in course.requirements" :key="key">
                                            {{item.description}}
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <!-- // Course Description -->
                            <div class="mt-5">
                                <h4>Description</h4>
                                <div class="mt-4">
                                    <client-only>
                                        <read-more more-str="read more" less-str="read less" :max-chars="1000" :text="course.description"></read-more>
                                    </client-only>
                                </div>
                            </div>

                            <div class="mt-5">
                                <h4>Who this course is for?</h4>
                                <div class="mt-4">
                                    <ul class="pl-3 text-justify">
                                        <li v-for="who in course.whos" :key="who.id">
                                            {{who.description}}
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <!-- // Might Like Courses -->
                            <div class="mt-5" v-if="mightLikes.length != 0">
                                <h4>You might like</h4>
                                <hr class="mb-0 mt-3" style="border-top: 0.25rem solid rgba(0, 0, 0, 0.1);">
                                <div v-for="(item, key) in mightLikes" :key="key" class="search_body py-2 pl-2 pr-3 border-bottom">
                                    <router-link :to="{ name: 'course.show', params: { slug: item.slug } }">
                                        <div class="row justify-content-between">
                                            <div class="col-lg-auto">
                                                <client-only>
                                                    <cld-image :publicId="`${item.image_public_id}.png`" alt="" >
                                                        <cld-transformation height="70" width="125" crop="fill" />
                                                    </cld-image>
                                                </client-only>
                                            </div>
                                            <div class="col-lg-5">
                                                <h6 class="mb-0 font-weight-600">{{item.title}}</h6>
                                                <h6 class="text-muted mt-1"><small>Updated {{item.updated_at | moment(' L')}}</small></h6>
                                            </div>
                                            <div class="col-lg-2">
                                                <div class="d-inline-flex">
                                                    <div>
                                                        <p class="mb-0 text-dark"><fa icon="star" fixed-width style="color: #f4c150" />{{ averageRating(item) }}</p>
                                                    </div>
                                                    <div>
                                                        <div class="ml-3">
                                                            <p class="mb-0 text-dark"><fa icon="user" fixed-width class="text-muted" />{{ item.students_count }}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-lg-2">
                                                <div class="float-right">
                                                    <template v-if="!item.free_course">
                                                        <div v-if="item.has_discount == 0">
                                                            <h6 class="font-weight-bold text-right">₱{{item.price | numeral('0,0.00')}}</h6>
                                                        </div>
                                                        <div v-if="item.has_discount == 1">
                                                            <h6 class="font-weight-bold text-right">₱{{item.discount | numeral('0,0.00')}}</h6>
                                                            <h6 class="text-muted float-right"><strike>₱{{item.price | numeral('0,0.00')}}</strike></h6>
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        <h6 class="text-right">Free Course</h6>
                                                    </template>
                                                </div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>

                            <!-- // Course Tutor  -->
                            <div class="mt-5" id="course-instructor">
                                <div class="row">
                                    <div class="col-lg-3">
                                        <template v-if="instructor.avatar != 'users/default.png'" >
                                            <client-only>
                                                <cld-image :publicId="`${instructor.avatar_public_id}.png`" alt="" >
                                                    <cld-transformation height="130" width="130" crop="fill" radius="100" />
                                                </cld-image>
                                            </client-only>
                                        </template>

                                        <img v-if="instructor.avatar == 'users/default.png'" :src="instructor.photo_url" class="rounded-circle img-fluid course__user-img" alt="">

                                        <ul class="list-unstyled mt-3">
                                            <li class=" mb-1"><fa icon="star" fixed-width /> <b>{{ instructorAverage(instructorDatas) }}</b> Instructor rating</li>
                                            <li class=" mb-1"><fa icon="comment" fixed-width /> <b>{{ instructor.my_reviews_count }}</b> Reviews</li>
                                            <li class=" mb-1"><fa icon="user" fixed-width /> <b>{{ instructorDatas.students_count }}</b> Students</li>
                                            <li class=""><fa icon="play-circle" fixed-width /> <b>{{ instructor.courses_count }}</b> Courses</li>
                                        </ul>
                                    </div>
                                    <div class="col-lg-8">
                                        <h5 class="mt-2 mb-1"><b>{{instructor.name}}</b></h5>
                                        <h6 class="text-dark">{{instructor.introduction}}</h6>
                                        <div class="mt-3">
                                            <client-only>
                                                <read-more v-if="instructor.biography" more-str="read more" less-str="read less" :max-chars="500" :text="instructor.biography"></read-more>
                                            </client-only>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- // Student Feedbacks -->
                            <div class="mt-5">
                                <h4>Student Feedback</h4>
                                <div class="mt-4">
                                    <student-feedback :ratings_count="course.ratings_count" :average="avgRating" :ratings="feedBacks" :five="fiveRating" :four="fourRating" :three="threeRating" :two="twoRating" :one="oneRating"></student-feedback>
                                </div>
                            </div>


                        </div>
                        <!-- // Card Course Video Overview -->
                        <div class="col-lg-4 hidden-xs-down">
                            <div :class="{ 'd-none' : showPopup }" class="ml-lg-3">
                                <div class="card shadow-sm" style="margin-top: -335px; width: 350px;">
                                    <div class="card-body p-0">
                                        <div class="preview-video-box">
                                            <a href="#" @click="openPlayerModal">
                                                <img :src="course.image" class="img-fluid" style="width: 100%; height: 215px;" alt="">
                                                <span class="play-btn"></span>
                                            </a>
                                        </div>
                                        <div v-if="enrolled_course" class="p-1 px-3 bg-info w-100">
                                            <p class="mb-0 text-white">
                                                <small><fa icon="info-circle" fxied-width /> &nbsp; You purchased this course on {{ enrolled_at.pivot.created_at | moment('MMM. D, YYYY') }} </small>
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
                                                        <h2 class="font-weight-bold mb-0" v-if="!enrolled_course">Free Course </h2>
                                                    </template>
                                                </div>
                                                </h2>
                                            </div>
                                            <div>
                                                <template v-if="!course.free_course">
                                                    <template v-if="user">
                                                        <div>
                                                            <button class="btn btn-danger btn-lg text-capitalize btn-block border rounded" :class="{ 'btn-loading' : busy }" :disabled="busy">
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
                                                    <template v-if="!enrolled_course">
                                                        <template v-if="user">
                                                            <button class="btn btn-danger btn-lg text-capitalize btn-block rounded border" :class="{ 'btn-loading' : busy }" :disabled="busy" @click="enroll">
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
                                                        <router-link :to="{ name: 'student.courses.learn' , params: { slug: course.slug, lesson_id: course.first_lesson.id } }" class="btn btn-primary btn-lg text-capitalize btn-block rounded border">
                                                            Go to course
                                                        </router-link>
                                                    </template>
                                                </template>
                                            </div>
                                            <div class="mt-3">
                                                <p class="font-weight-bold mb-2">Includes:</p>
                                                <ul class="list-unstyled small" style="color: #505763;">
                                                    <li v-for="item in includes" :key="item.id" class="mb-1">
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
            </section>

            <transition name="fade" mode="out-in">
                <share-buttons v-if="showShareButtons" @close="closeShareButtonsModal" :course="course"></share-buttons>
            </transition>

            <div v-show="isModalVisible" tabindex="0" @keydown.esc.stop="closePlayerModal">
                <transition name="fade" mode="out-in">
                    <video-plyr v-if="isModalVisible" @close="closePlayerModal" :title="course.title"></video-plyr>
                </transition>
            </div>


            <!-- // Modal -->
            <transition name="fade" mode="out-in">
                <modal-login v-if="showLoginModal" @close="closeLoginModal"></modal-login>
            </transition>

        </div>

    </div>
</template>

<script>
    let myBody = null

    import axios from 'axios'
    import MightLikes from '../../components/global/MightLike'

    // Modals
    import VideoPlyr from '../../components/courses/show/video-plyr'
    import SectionAccordion from '../../components/courses/show/accordion'

    import ShareButtons from '../../components/courses/show/share'
    import AddToCart from '../../components/courses/show/add-to-cart'
    import StarRating from 'vue-star-rating'
    import ModalLogin from '~/components/auth/modal_login'

    import StudentFeedback from '~/components/courses/show/student_feedback'

    import { mapGetters } from 'vuex'

    export default {

        components: {
            MightLikes, VideoPlyr, AddToCart,
            SectionAccordion, ShareButtons,
            StarRating, ModalLogin, StudentFeedback
        },

        layout: 'default',

        head() {
            return {
                title: this.course.title,
                meta: [
                    { hid: 'description', name: 'description', content: this.course.excerpt },
                    { hid: 'keywords', name: 'keywords', content: this.course.meta_keywords},

                    // Facebook Meta Tags
                    { hid: 'og:url', name: 'og:url', content: this.url },
                    { hid: 'og:title', name: 'og:title', content: this.course.title },
                    { hid: 'og:image', name: 'og:image', content: this.image },
                    { hid: 'og:description', name: 'og:description', content: this.course.excerpt }
                ]
            }
        },

        data: function () {
            return {
                isModalVisible: false,
                isExpandedOutcome: false,
                MightLikes: [],
                showShareButtons: false,
                // Detect scroll
                showPopup: false,
                lastScrollPosition: 0,
                courseInCart: false,
                url: '',
                showLoginModal: false,
                busy: false
            }
        },

        async asyncData({ params, error }) {
            try {
                let { data } = await axios.get(`/course/${params.slug}`)
                return {
                    instructor: data.instructor,

                    // Main Data
                    course: data.course,

                    // Computation of discount percentage
                    percentage: ((1 - (data.course.discount / data.course.price)) * 100).toFixed(0),

                    // Course the user might like
                    mightLikes: data.mightLikes,

                    // Course Content
                    sections: data.sections,
                    lessons: data.lessons,
                    quizzes: data.quizzes,

                    duration: data.totalDuration,
                    countLessons: data.countLessons,

                    totalLessonDuration: data.totalLessonDuration,

                    addedToCart: data.addedToCart,

                    enrolled_course: data.enrolled_course,
                    enrolled_at: data.enrolled_at,
                    students: data.enrolled_students,

                    avgRating: data.avgRating,

                    feedBacks: data.feedBacks,

                    fiveRating: data.fiveRating,
                    fourRating: data.fourRating,
                    threeRating: data.threeRating,
                    twoRating: data.twoRating,
                    oneRating: data.oneRating,

                    instructorDatas: data.instructorDatas
                }
            } catch (e) {
                error({ statusCode: 500, message: 'Something went wrong!' })
            }
        },

        created: function () {
            this.url = 'http://192.168.2.112:3000' + this.$route.path
        },

        computed: {
            ...mapGetters({
                user: 'auth/user'
            }),
            includes() {
                return [
                    {
                        icon: ['far', 'file-video'],
                        value: `${this.duration} Hours on demand video`
                    },
                    {
                        icon: ['far', 'file'],
                        value: `${this.lessons.length} Lessons`
                    },
                    {
                        icon: ['far', 'compass'],
                        value: 'Full Lifetime Access'
                    }
                ]
            },

            courseAddedToCart: function () {
                if (addedToCart) {
                    this.courseInCart = true
                } else {
                    this.courseInCart = false
                }
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
            showOutcome() {
                this.isExpandedOutcome = true
            },
            lessOutcome() {
                this.isExpandedOutcome = false
            },

            // Open Video Player Modal
            openPlayerModal() {
                this.isModalVisible = true
                this.$el.focus()

                // Add class to body
                myBody.classList.toggle('modal-open')
            },
            closePlayerModal() {
                this.isModalVisible = false
                myBody.classList.remove('modal-open')
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

            onScroll: function () {
                const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop

                if (currentScrollPosition < 0) {
                    return
                }

                this.showPopup = currentScrollPosition >= 350
                this.lastScrollPosition = currentScrollPosition
            },

            openLoginModal: function () {
                this.showLoginModal = true

                // Add class to body
                myBody.classList.toggle('modal-open')
            },

            closeLoginModal: function () {
                this.showLoginModal = false
                myBody.classList.remove('modal-open')
            },

            async enroll() {
                this.busy = true
                try {
                    let { data } = await axios.post(`/cart/subscribe/course/${this.course.id}/post`)
                    this.$router.push({ name: 'student.courses.learn', params: { slug: this.$route.params.slug, lesson_id: this.course.first_lesson.id } })
                    this.busy = false
                    this.$swal({
                        type: 'success',
                        text: data.message
                    })
                } catch (e) {
                    this.busy = false
                    this.$swal({
                        type: 'error',
                        text: e.resonse.data.message
                    })
                }
            },

            averageRating: function (item) {
                return parseFloat(item.rating_average).toFixed(1)
            },

            instructorAverage: function (instructorDatas) {
                return parseFloat(instructorDatas.rating_average).toFixed(1)
            }

        },


    }

</script>

<style lang="scss" scoped>
    .course-header-wrap .course-badge {
        font-size: 9px !important;
    }
    .course-badge.best-seller {
        background: #f4c150;
    }
    .course-header-wrap > div > span {
        margin-right: 12px;
        margin-bottom: 7px;
        font-size: 15px;
    }
    .course-badge {
        color: #29303b;
        box-shadow: 0 0 1px 1px rgba(20,23,28,.1), 0 3px 1px 0 rgba(20,23,28,.1);
        pointer-events: none;
        border-radius: 3px;
        font-size: 9px;
        padding: 1px 8px;
        font-weight: 700;
        position: relative;
        line-height: 1.5;
        text-align: center;
        text-transform: uppercase;
        display: inline-block;
    }
    .course-badge:after {
        border-radius: 3px;
        right: -4px;
        background: inherit;
        content: "";
        height: 11px;
        position: absolute;
        top: 2px;
        transform: rotate(45deg);
        width: 11px;
        z-index: 0;
        display: block;
    }
    .course-header-wrap > div > span {
        margin-right: 12px;
        margin-bottom: 7px;
        font-size: 15px;
    }
    .course-sidebar {
        background-color: #fff;
        box-shadow: 0 0 1px 1px rgba(20,23,28,.1), 0 3px 1px 0 rgba(20,23,28,.1);
        border-radius: 4px;
        color: #505763;
        padding: 3px;
        position: relative;
        margin-top: -250px;
        z-index: 10;
    }
    .mt---1 {
        margin-top: -95%;
    }
    .sticky-top {
        z-index: 0 !important;
    }
    .search {
        &_image {
            width: 125px;
            height: 70px;
            object-fit: cover;
        }
        &_body {
            cursor: pointer;
        }
        &_body:hover {
            background: whitesmoke;
        }
    }
    .play-btn {
        left: 0;
        width: 100%;
        height: 40%;
        position: absolute;
        background: url(https://res.cloudinary.com/dl9phqhv0/image/upload/v1578625817/Logos/icon-play_z0hvqf.svg) no-repeat;
        background-size: auto 50%;
        background-position: 50%;
        visibility: visible;
        -webkit-transition: -webkit-transform .15s ease-in-out;
        -moz-transition: -moz-transform .15s ease-in-out;
        -o-transition: -o-transform .15s ease-in-out;
        transition: transform .15s ease-in-out;
    }
    .preview-video-box a:hover > .play-btn {
        -webkit-transform: scale(1.2);
        -ms-transform: scale(1.2);
        -o-transform: scale(1.2);
        transform: scale(1.2);
    }
</style>
