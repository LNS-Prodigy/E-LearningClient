<template>
    <div class="m-0">
        <div class="app-sidebar">
            <div>
                <div class="sidebar--header">
                    Course Content
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="$emit('close')"><span aria-hidden="true">&times;</span></button>
                </div>
                <div class="sidebar--content" :style="`height: ${window.height}px;`">
                    <div>
                        <div class="accordion course__curriculum-accordion" id="accordionExample">
                            <div class="card border-0 lecture__group-wrapper bg-transparent" v-for="(section, index) in sections" :key="index">
                                <div class="" id="headingOne">
                                    <div class="lecture__group-title-2 clearfix mb-0" data-toggle="collapse" :data-target="`#collapse-${index}`" :aria-expanded="index == 0 ? 'true' : 'false'" aria-controls="collapseOne">
                                        <a class="text-capitalize text-dark" type="button">
                                            Section {{ index + 1 }}: {{ section.title }}
                                        </a>
                                        <div>
                                            <span class="text-capitalize text-dark"><small>{{ section.progress_count }} / {{ section.lessons_count }} &nbsp; Completed</small></span>
                                        </div>
                                    </div>
                                </div>

                                <div :id="`collapse-${index}`" class="collapse" :class="{ 'show' : index == 0 }" aria-labelledby="headingOne" data-parent="#accordionExample">
                                    <div class="card-body p-0 bg-white">
                                        <div class="lecture-list-2">
                                            <ul class="list-unstyled mb-0">
                                                <template v-for="(lesson, index) in lessons">
                                                    <router-link :to="{ name: 'student.courses.learn', params: { slug: courseSlug, lesson_id: lesson.id } }" :key="`${index}-lesson`">
                                                        <li v-if="lesson.course_section_id == section.id" class="lecture has-preview lesson-hover">
                                                            <div class="d-flex">
                                                                <!-- // If Lesson Progress is not yet Completed -->
                                                                <div v-if="lesson.get_progress.status != 1">
                                                                    <div class="custom-control custom-checkbox d-flex">
                                                                        <input
                                                                            :id="`id-lesson-${index + 1}`"
                                                                            :name="`name-lesson-${index + 1}`"
                                                                            :checked="lesson.get_progress.status == 1"
                                                                            type="checkbox"
                                                                            class="custom-control-input"
                                                                        >
                                                                        <label :for="`id-lesson-${index + 1}`" class="custom-control-label my-auto" @click.prevent="checkboxToggle(lesson, index, section)">
                                                                        </label>
                                                                    </div>
                                                                </div>

                                                                <!-- // Else -->
                                                                <div v-else>
                                                                    <div class="custom-control custom-checkbox d-flex">
                                                                        <input
                                                                            :id="`id-lesson-${index + 1}`"
                                                                            :name="`name-lesson-${index + 1}`"
                                                                            :checked="lesson.get_progress.status == 1"
                                                                            type="checkbox"
                                                                            class="custom-control-input"
                                                                        >
                                                                        <label :for="`id-lesson-${index + 1}`" class="custom-control-label my-auto"></label>
                                                                    </div>
                                                                </div>

                                                                <div class="ml-3">
                                                                    <span class="lecture-title">{{ index + 1 }}.  {{lesson.title}}</span>
                                                                    <div v-if="lesson.lesson_type === 'VIDEO'">
                                                                        <small><fa icon="play-circle" fixed-width /> {{ lesson.duration }}</small>
                                                                    </div>
                                                                    <div v-if="lesson.lesson_type === 'TFILE'">
                                                                        <small><fa :icon="['far', 'file']" fixed-width /> File Attachment</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </router-link>
                                                </template>
                                            </ul>
                                        </div>
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

    export default {

        props: [
            'sections', 'lessons', 'courseSlug'
        ],

        data: function () {
            return {
                form: new Form({
                    status: false
                }),

                window: {
                    height: '549'
                },

                params: ''
            }
        },

        created() {
            if (process.client) {
                window.addEventListener('resize', this.handleResize)
            }
            this.handleResize()
        },

        destroyed() {
            if (process.client) {
                window.removeEventListener('resize', this.handleResize)
            }
        },

        methods: {
            async checkboxToggle(lesson, index, section) {
                try {
                    let { data } = await this.form.patch(`/student/account/my-courses/learning/lesson/${lesson.id}/finish`)

                    this.$swal({
                        toast: true,
                        position: 'bottom-end',
                        timer: 5000,
                        showConfirmButton: false,
                        type: 'success',
                        text: data.message
                    })

                    this.form.status = true

                    section.progress_count++

                    var newValue = {
                        index: index,
                        id: data.id,
                        status: data.status
                    }

                    this.$emit('clicked', newValue)
                } catch (e) {
                    console.log(e)
                }
            },

            handleResize: function () {
                if (process.client) {
                    this.window.height = window.innerHeight
                }
            }
        },

        computed: {
            currentParam: function () {
                this.params = this.$route.params.lesson_id
            }
        }

    }
</script>

<style lang="scss" scoped>
    .app-sidebar {
        position: fixed;
        right: 0;
        width: 25%;
    }

    .sidebar {
        &--header {
            font-size: 16px;
            font-weight: 600;
            line-height: 1.5em;
            display: flex;
            justify-content: space-between;
            padding: 16px;
            border: 1px solid #dedfe0;
            border-right: none;
            background: #fff;
        }
        &--content {
            z-index: 10000;
            background-color: #fff;
            border: 1px solid #e8e9eb;
            overflow-x: hidden;
            overflow-y: auto;
        }
    }

    .lesson-hover:hover {
        background: #e6f2f5;
    }

    .router-link-active .lesson-hover {
        background: #e6f2f5;
    }

    .custom-control {
        min-height: 0.44rem !important;
    }
</style>
