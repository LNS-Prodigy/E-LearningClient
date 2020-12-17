<template>
    <div>
        <client-only>
			<offline-alert/>
		</client-only>

        <h4 class="mb-0 m-t-8 font-weight-400"><img src="https://res.cloudinary.com/dl9phqhv0/image/upload/v1576466807/Online%20Learning%20Icon%20Pack/035-essay_ax80uj.svg" style="width: 60px; height: 60px;" alt=""> &nbsp; Course Preview</h4>

        <div class="mt-3">
            <div class="row justify-content-between">
                <div class="col-lg-8">
                    <ul class="list-group">
                        <!-- // Title -->
                        <li class="list-group-item">
                            <small class="text-muted text-uppercase">title</small>
                            <div class="content mt-3">
                                <h4>{{course.title}}</h4>
                                <p class="text-muted small mb-0">Slug: {{course.slug}}</p>
                            </div>
                        </li>
                        <!-- // Excerpt -->
                        <li class="list-group-item">
                            <small class="text-muted text-uppercase">excerpt</small>
                            <div class="content mt-3">
                                <p class="mb-0">{{course.excerpt}}</p>
                            </div>
                        </li>
                        <!-- //Description -->
                        <li class="list-group-item">
                            <small class="text-muted text-uppercase">description</small>
                            <div class="content mt-3">
                                <client-only>
                                    <read-more more-str="read more" less-str="read less" :max-chars="1000" :text="course.description"></read-more>
                                </client-only>
                            </div>
                        </li>
                        <!-- // Media -->
                        <li class="list-group-item">
                            <small class="text-muted text-uppercase">Media</small>
                            <a href="#" @click="toggleMedia" class="float-right small text-uppercase">
                                <span v-if="!showMedia">Show</span>
                                <span v-else>Hide</span>
                            </a>
                            <div class="content mt-3" v-if="showMedia">
                                <ul class="list-group">
                                    <li class="list-group-item">
                                        <small class="text-muted text-uppercase">Thumbnail</small>
                                        <div class="content mt-3">
                                            <img :src="course.image" class="img-fluid" alt="">
                                        </div>
                                    </li>
                                    <li class="list-group-item">
                                        <small class="text-muted text-uppercase">Course Overview Provider</small>
                                        <div class="content mt-3">
                                            <p class="mb-0">{{course.course_overview_provider}}</p>
                                        </div>
                                    </li>
                                    <li class="list-group-item">
                                        <small class="text-muted text-uppercase">Course Preview</small>
                                        <div class="content mt-3">
                                            <div>
                                                <!-- // Youtube -->
                                                <vue-plyr v-if="course.course_overview_provider === 'Youtube'">
                                                    <div class="plyr__video-embed">
                                                        <iframe
                                                        :src="`https://www.youtube.com/embed/${course.course_overview_url}?iv_load_policy=3&modestbranding=1&playsinline=1&showinfo=0&rel=0&enablejsapi=1`"
                                                        allowfullscreen allowtransparency allow="autoplay">
                                                        </iframe>
                                                    </div>
                                                </vue-plyr>

                                                <vue-plyr v-else-if="course.course_overview_provider === 'Vimeo'">
                                                    <div class="plyr__video-embed">
                                                        <iframe
                                                            :src="`https://player.vimeo.com/video/${course.course_overview_url}?loop=false&byline=false&portrait=false&title=false&speed=true&transparent=0&gesture=media`"
                                                            allowfullscreen allowtransparency allow="autoplay">
                                                        </iframe>
                                                    </div>
                                                </vue-plyr>

                                                <!-- https://www.w3schools.com/html/mov_bbb.mp4 -->
                                                <!-- video element -->
                                                <vue-plyr v-else-if="course.course_overview_provider === 'HTML5'">
                                                    <video :poster="course.image" src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer.mp4">
                                                        <source src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4" type="video/mp4" size="576">
                                                        <source src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4" type="video/mp4" size="720">
                                                        <source src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4" type="video/mp4" size="1080">
                                                        <track kind="captions" label="English" srclang="en" src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer.vtt" default>
                                                    </video>
                                                </vue-plyr>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <small class="text-muted text-uppercase">requirements</small>
                            <div class="content mt-3">
                                <ul>
                                    <li v-for="(item, index) in course.requirements" :key="index">
                                        {{item.description}}
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <small class="text-muted text-uppercase">outcomes</small>
                            <div class="content mt-3">
                                <ul>
                                    <li v-for="(item, index) in course.outcomes" :key="index">
                                        {{item.description}}
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <small class="text-muted text-uppercase">For who</small>
                            <div class="content mt-3">
                                <ul>
                                    <li v-for="(item, index) in course.whos" :key="index">
                                        {{item.description}}
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="col-lg-4">
                    <ul class="list-group">
                        <li class="list-group-item">
                            <small class="text-muted text-uppercase">Status</small>
                            <!-- <a href="#" class="float-right text-uppercase small" @click="toggleEditStatus">
                                <span v-if="!edittingStatus"><fa :icon="['far', 'edit']" fixed-width/> edit</span>
                                <span v-else>cancel</span>
                            </a> -->
                            <div class="content mt-3">
                                <template>
                                    <div>
                                        <div class="alert alert-primary" role="alert">
                                            <p class="text-uppercase text-center mb-0">{{course.status}}</p>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <small class="text-muted text-uppercase">Category</small>
                            <div class="content mt-3">
                                <p class="mb-0">{{course.category.name}}</p>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <small class="text-muted text-uppercase">language</small>
                            <div class="content mt-3">
                                <p class="mb-0">{{course.language}}</p>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <small class="text-muted text-uppercase">level</small>
                            <div class="content mt-3">
                                <p class="mb-0">{{course.level}}</p>
                            </div>
                        </li>
                        <li class="list-group-item">
                            <small class="text-muted text-uppercase">Price</small>
                            <div class="content mt-3">
                                <template v-if="course.free_course != 1">
                                    <div>
                                        <template v-if="course.has_discount != 0">
                                            <div>
                                                <p class="mb-0">{{course.discount}}</p>
                                                <p class="mb-0"><strike>{{course.price}}</strike></p>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div>
                                                <p class="mb-0">{{course.price}}</p>
                                            </div>
                                        </template>
                                    </div>
                                </template>
                                <template v-else>
                                    <div>
                                        <p class="mb-0">Free Course</p>
                                    </div>
                                </template>
                            </div>
                        </li>
                    </ul>
                    <!-- // Actions -->
                    <div class="row mt-3">
                        <div class="col-lg-6">
                            <router-link :to="{ name: 'student.courses.learn', params: { slug: course.slug, lesson_id: course.first_lesson.id } }" class="btn btn-default btn-block text-capitalize">
                                View course
                            </router-link>
                        </div>
                        <div class="col-lg-6">
                            <router-link :to="{ name: 'instructor.courses.edit', params: { slug: course.slug } }" class="btn btn-success btn-block text-capitalize">
                                Edit Course
                            </router-link>
                        </div>
                    </div>

                    <div class="mt-3">
                        <button type="button" class="btn btn-outline-danger btn-block" @click="remove">
                            <fa icon="trash-alt" fixed-width /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import Form from 'vform'
    import axios from 'axios'

    export default {

        scrollToTop: false,
        
        head() {
            return { title: 'Showing ' + `'${this.course.title}'` }
        },

        data: () => ({
            showMedia: false,
            edittingStatus: false,

            form: new Form({
                status: ''
            }),

            isRemoving: false
        }),

        async asyncData({ params }) {
            let { data } = await axios.get(`/instructor/courses/${params.slug}`)
            return {
                course: data.course
            }
        },

        computed: {
            statusLists: function() {
                return [
                    {
                        value: 'UNPUBLISHED',
                        name: 'Unpublish'
                    },
                    {
                        value: 'PUBLISHED',
                        name: 'Publish'
                    }
                ]
            }
        },

        methods: {
            toggleMedia: function () {
                this.showMedia = !this.showMedia
            },

            toggleEditStatus: function () {
                this.edittingStatus = !this.edittingStatus
            },

            async saveStatus() {
                try {
                    let { data } = await this.form.submit('patch', `/instructor/courses/${this.course.id}/editStatus`)
                    this.$swal({
                        type: 'success',
                        text: data.message
                    })
                    this.edittingStatus = false
                    this.course.push(this.form)
                } catch (e) {
                    return
                }
            },

            remove: function () {
                this.isRemoving = true
                this.$swal({
                    title: "Are you sure?",
                    text: "You will not be able to recover this course!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#ee395b",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "Cancel"
                }).then((res) => {
                    if (res.value) {
                        axios.delete(`/instructor/courses/${this.course.id}`)
                        this.$swal({
                            type: 'success',
                            text: 'Course is deleted permanently',
                        })
                        this.$router.push({ name: 'instructor.courses' })
                    } else {
                        this.$swal({
                            type: 'info',
                            text: 'Delete Cancelled'
                        })
                        this.isRemoving = false

                    }
                })
            }

        }

    }
</script>

<style>

</style>