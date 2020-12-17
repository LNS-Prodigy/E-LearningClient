<template>
    <div>

           <!-- // Add buttons -->
        <div class="text-center">
            <button v-if="!showAddSectionModal" class="btn btn-outline-primary rounded btn-sm ml-1" @click.prevent="openSectionModal"><fa icon="plus" /> Add Section</button>

            <button v-if="!showAddLessonModal" class="btn btn-outline-primary rounded btn-sm ml-1" @click.prevent="openLessonModal"><fa icon="plus" /> Add Lesson</button>

            <button v-if="!showAddQuizbankModal" class="btn btn-outline-primary rounded btn-sm ml-1" @click.prevent="openQuizbankModal"><fa icon="plus" /> Add Quiz bank</button>
        </div>

        <div v-if="!isLoading">
            <!-- // Sections & Lesson  -->
            <template v-if="sectionsNew.length != 0">
                <div class="my-5">
                    <draggable class="drag-area" :list="sectionsNew" :options="{ animation: 200, handle: '.drag-me' }" :element="'div'" :noTransitionOnDrag="false" @change="update">
                        <section class="p-4 rounded bg-secondary mb-3 course__section" v-for="(section, index) in sectionsNew" :key="`${section.id}-section`">
                            <!-- // Draggable -->
                            <span class="float-right my-handle">
                                <button v-if="courseStatus == 'PENDING'" class="btn btn-outline-danger btn-sm" @click.prevent="removeSection(section, index)">
                                    <fa icon="trash-alt" fixed-width />
                                </button>
                                <a href="#" class="btn p-1 px-2 btn-outline-default btn-sm" @click.prevent="openEditSectionModal(section, index)"><fa :icon="['far', 'edit']" fixed-width /> Edit</a>
                                <span class="drag-me">
                                    <fa class="mt-1" icon="grip-vertical" fixed-width style="cursor: move;" />
                                </span>
                            </span>

                            <!-- // Section description -->
                            <h6 class="mb-4">Section {{index + 1}} : &nbsp; <b>{{section.title}}</b> </h6>

                            <draggable class="drag-area" :list="lessonsNew" :options="{ animation: 200, handle: '.drag-me-lesson' }" :element="'div'" :noTransitionOnDrag="false" @change="updateLessonsOrder">
                                <!-- // Lessons -->
                                <div v-for="(lesson, index) in lessonsNew" :key="`${index}-lesson`" class="course__section-lesson">
                                    <div v-if="lesson.course_section_id == section.id" class="p-3 bg-white border rounded mb-2">
                                        <span class="float-right my-lessons-handle">
                                            <button class="btn btn-outline-danger btn-sm" @click.prevent="removeLesson(lesson, index)">
                                                <fa icon="trash-alt" fixed-width />
                                            </button>
                                            <a href="#" class="btn p-1 px-2 btn-outline-default btn-sm" @click.prevent="openEditLessonModal(lesson, index)">
                                                <fa :icon="['far', 'edit']" fixed-width /> Edit
                                            </a>
                                            <span class="drag-me-lesson">
                                                <fa icon="grip-vertical" fixed-width style="cursor: move;" />
                                            </span>
                                        </span>
                                        <h6 class="mb-0" style="line-height: 1.5rem;">
                                            <fa icon="play-circle" fixed-width v-if="lesson.lesson_type === 'VIDEO'" />
                                            <fa :icon="['far', 'file']" fixed-width v-if="lesson.lesson_type === 'TFILE'" />
                                            <span class="text-muted">
                                                Lesson {{index + 1}}
                                            </span>
                                            <span class="font-weight-bold"> : &nbsp; {{lesson.title}}</span>
                                        </h6>
                                        <div v-if="lesson.lesson_provider === 'HTML5'" class="mt-3">
                                            <client-only>
                                                <vue-plyr>
                                                    <video :poster="lesson.thumbnail" :src="lesson.video_url">
                                                        <source :src="lesson.video_url" type="video/mp4" >
                                                    </video>
                                                </vue-plyr>
                                            </client-only>
                                        </div>
                                    </div>
                                </div>
                            </draggable>

                            <div v-if="quizBanks.length != ''">
                                <div v-for="(bank, index) in quizBanks" :key="`quizbank-${index + 1}`" class="course__section-quiz-bank">
                                    <div class="border-top" v-if="bank.section_id == section.id">
                                        <div class="p-3 mt-2 bg-white border rounded mb-2">
                                            <span class="font-weight-bold"><fa icon="university" fixed-width /> Quiz Bank - </span>
                                            <span class="small text-muted">{{ bank.number_of_questions }} Questions to Show</span>
                                            <div v-if="quizzes.length < bank.number_of_questions" class="d-inline-flex float-right">
                                                <span class="my-quiz-bank">
                                                    <button v-if="!showAddQuizModal" class="btn btn-outline-default rounded btn-sm" @click.prevent="openQuizModal(bank, index)"><fa icon="plus" /> Quiz</button>
                                                </span>
                                            </div>
                                            <!-- // Quizzes -->
                                            <div class="mt-3" v-if="quizzes.length != ''">
                                                <div class="p-3 bg-secondary rounded">
                                                    <h6 class="font-weight-600"><fa icon="bolt" fixed-width /> Quizzes</h6>
                                                    <div>
                                                        <ul class="mb-0">
                                                            <li v-for="(quiz, index) in quizzes" :key="quiz.id">
                                                                {{ quiz.title }}
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </section>
                    </draggable>
                </div>
            </template>

            <template v-else>
                <div class="my-5">
                    <div class="text-center">
                        <img src="https://res.cloudinary.com/dl9phqhv0/image/upload/c_scale,h_130/v1576466809/Online%20Learning%20Icon%20Pack/042-book_iscdda.svg" class="img-fluid" width="130" height="130" alt="">
                        <h6>You don't have any curriculums yet.</h6>
                    </div>
                </div>
            </template>
        </div>

        <div v-else>
            <div class="my-5 text-center">
                <img src="https://res.cloudinary.com/dl9phqhv0/image/upload/v1574394025/Loader/ajax-loader_sln1xw.gif" alt="">
            </div>
        </div>

        <!-- // Modals -->
        <transition name="fade">
            <add-section-modal :course_id="course_id" v-if="showAddSectionModal" @close="closeSectionModal" @clicked="saveNewSection" v-click-outside="closeSectionModal"></add-section-modal>
        </transition>

        <transition name="fade">
            <edit-section-modal :data="sectionData" :index="indexNum" v-if="showEditSectionModal" @close="closeEditSectionModal" @clicked="saveNewEditedSection"></edit-section-modal>
        </transition>

        <transition name="fade">
            <add-lesson-modal :course_id="course_id" v-if="showAddLessonModal" @close="closeLessonModal" @clicked="saveNewLesson"></add-lesson-modal>
        </transition>

        <transition name="fade">
            <edit-lesson-modal :data="lessonData" :index="indexLes" :sections="sections" v-if="showEditLessonModal" @close="closeEditLessonModal" @clicked="saveNewEditedLesson"></edit-lesson-modal>
        </transition>

        <transition name="fade">
            <add-quizbank-modal :course_id="course_id" :sections="sections" v-if="showAddQuizbankModal" @close="closeQuizbankModal" @clicked="saveNewQuizbank"></add-quizbank-modal>
        </transition>

        <transition name="fade">
            <add-quiz-modal :course_id="course_id" :bank="bankData" :index="bankIndex" v-if="showAddQuizModal" @close="closeQuizModal" @clicked="saveNewQuiz"></add-quiz-modal>
        </transition>

    </div>
</template>

<script>
    let myBody = null

    import Form from 'vform'
    import axios from 'axios'


    import AddSectionModal from './add_section'
    import EditSectionModal from './edit_section'

    import AddLessonModal from './add_lesson'
    import EditLessonModal from './edit_lesson'

    import AddQuizbankModal from './add_quizbank'
    import AddQuizModal from './add_quiz'

    // Draggable
    import draggable from 'vuedraggable'

    export default {

        props: ['course_id', 'sections', 'lessons', 'quizBanks', 'quizzes', 'courseStatus'],

        components: {
            AddSectionModal, AddLessonModal, AddQuizModal,
            draggable, AddQuizbankModal, EditSectionModal, EditLessonModal
        },

        data: function() {
            return {

                // Modals
                // Section Create, Update, Edit, Delete
                showAddSectionModal: false,
                showEditSectionModal: false,

                showAddLessonModal: false,
                showEditLessonModal: false,

                showAddQuizModal: false,
                showAddQuizbankModal: false,

                isLoading: false,

                hover: false,

                // Draggables
                sectionsNew: this.sections,
                lessonsNew: this.lessons,

                editingSection: false,

                isRemoving: false
            }
        },

        methods: {

            async update () {
                this.sectionsNew.map((section, index) => {
                    section.order_index = index + 1
                })

                await axios.put(`/instructor/courses/section/order_index/${this.course_id}`, {
                    sections: this.sectionsNew
                }).then((res) => {
                    console.log(res)
                })
            },

            async updateLessonsOrder () {
                this.lessonsNew.map((lesson, index) => {
                    lesson.order_index = index + 1
                })

                await axios.put(`/instructor/courses/section/lesson/order_index/${this.course_id}`, {
                    lessons: this.lessonsNew
                }).then((res) => {
                    console.log(res)
                }).catch((err) => {
                    console.log(err)
                })
            },

            // Section Crud
            openSectionModal: function () {
                this.showAddSectionModal = true

                // Add Class to bdy
                 myBody.classList.toggle('modal-open')
            },

            closeSectionModal: function () {
                this.showAddSectionModal = false
                myBody.classList.remove('modal-open')
            },

            openEditSectionModal: function (data, index) {
                this.sectionData = data
                this.indexNum = index
                this.showEditSectionModal = true

                // Add modal-open to body
                myBody.classList.toggle('modal-open')
            },

            closeEditSectionModal: function () {
                this.showEditSectionModal = false
                myBody.classList.remove('modal-open')
            },

            openLessonModal: function () {
                this.showAddLessonModal = true

                // Add Class to Body
                myBody.classList.toggle('modal-open')
            },

            closeLessonModal: function () {
                this.showAddLessonModal = false
                myBody.classList.remove('modal-open')
            },

            openEditLessonModal: function (data, index) {
                this.showEditLessonModal = true

                this.lessonData = data
                this.indexLes = index

                // Add class to body
                myBody.classList.toggle('modal-open')
            },

            closeEditLessonModal: function () {
                this.showEditLessonModal = false

                myBody.classList.remove('modal-open')
            },

            openQuizbankModal: function () {
                this.showAddQuizbankModal = true

                // add Class to Body
                myBody.classList.toggle('modal-open')
            },

            closeQuizbankModal: function() {
                console.log('modal close')
                this.showAddQuizbankModal = false
                myBody.classList.remove('modal-open')
            },

            openQuizModal: function (data, index) {
                this.bankData = data
                this.bankIndex = index
                this.showAddQuizModal = true

                // Add Class to Body
                myBody.classList.toggle('modal-open')
            },

            closeQuizModal: function () {
                this.showAddQuizModal = false
                myBody.classList.remove('modal-open')
            },

            // Save New Section
            saveNewSection: function (value) {
                this.sections.push({
                    id: value.id,
                    title: value.title,
                    slug: value.slug
                })
            },

            saveNewEditedSection: function (value) {
                this.$set(this.sections[value.index], 'title', value.title)
            },

            // Save New Lesson
            saveNewLesson: function (value) {
                this.lessons.push({
                    course_section_id: value.course_section_id,
                    lesson_image: value.lesson_image,
                    title: value.title,
                    lesson_type: value.lesson_type,
                    lesson_provider: value.lesson_provider,
                    thumbnail: value.thumbnail,
                    video_url: value.video_url,
                    duration: value.duration,
                    lesson_attachment: value.lesson_attachment,
                    summary: value.summary,
                    id: value.id
                })
            },

            saveNewEditedLesson: function (value) {
                this.$set(this.lessons[value.index], 'title', value.title)
                this.$set(this.lessons[value.index], 'course_section_id', value.course_section_id)
            },


            saveNewQuizbank: function (value) {
                this.quizBanks.push({
                    id: value.id,
                    course_id: value.course_id,
                    section_id: value.section_id,
                    number_of_questions: value.number_of_questions,
                    created_at: value.created_at
                })
            },

            saveNewQuiz: function (value) {
                this.quizzes.push({
                    id: value.id,
                    title: value.title,
                    instruction: value.course_id,
                    course_id: value.course_id,
                    course_curriculum_section_id: value.course_curriculum_section_id,
                })
            },

            toggleHoverSection: function () {
                this.hoverSection = !this.hoverSection
            },

            removeLesson: function (lesson, index) {
                this.isRemoving = true
                this.$swal({
                    title: "Are you sure?",
                    text: "You will not be able to recover this lesson!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#ee395b",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "Cancel"
                }).then((res) => {
                    if (res.value) {
                        axios.delete(`/instructor/courses/section/delete_lesson/${lesson.id}`)
                        this.$delete(this.lessons, index)
                        this.$swal({
                            type: 'success',
                            text: 'Lesson is deleted permanently',
                        })
                    } else {
                        this.$swal({
                            type: 'info',
                            text: 'Delete Cancelled'
                        })
                        this.isRemoving = false

                    }
                })
            },

            removeSection: function (section, index) {
                this.isRemoving = true
                this.$swal({
                    title: "Are you sure?",
                    text: "You will not be able to recover this section!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#ee395b",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "Cancel"
                }).then((res) => {
                    if (res.value) {
                        axios.delete(`/instructor/courses/section/delete_section/${section.id}`)
                        this.$delete(this.sections, index)
                        this.$swal({
                            type: 'success',
                            text: 'Section is deleted permanently',
                        })
                    } else {
                        this.$swal({
                            type: 'info',
                            text: 'Delete Cancelled'
                        })
                        this.isRemoving = false

                    }
                })
            }


        },

        watch: {
            $route(newVal, oldVal) {
                this.showEditSectionModal = newVal.meta && newVal.meta.showEditSectionModal
                myBody.classList.toggle('modal-open')
            }
        },

        mounted: function () {
            myBody = document.getElementsByTagName('body')[0]
        },

        directives: {

            clickOutside: {
                bind: function (el, binding, vnode) {
                    el.eventSetDrag = function () {
                        el.setAttribute('data-dragging', 'yes')
                    }
                }
            }

        }


    }
</script>

<style lang="scss" scoped>
    .my-lessons-handle {
        display: none;
    }
    .edit-button {
        display: none !important;
    }
    .my-handle {
        display: none;
    }
    .my-quiz-bank {
        display: none;
    }
    .course__section-quiz-bank:hover .my-quiz-bank {
        display: block;
    }
    .course__section:hover .my-handle {
        display: block;
    }
    .course__section-lesson:hover .my-lessons-handle {
        display: block;
    }
    .modal-route {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba($color: #000000, $alpha: 0.5);
        .modal-content {
            width: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
        }
    }
</style>
