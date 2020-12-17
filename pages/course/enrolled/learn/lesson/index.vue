<template>
    <div>
        <navbar :courseTitle="course"></navbar>
        <div class="container-fluid vh-100">
            <div class="row">
                <!-- // Video Player -->
                <div class="col-lg-9 pr-0 pl-0">

                    <!-- // Players -->
                    <div class="player-height">
                        <!-- // Youtube -->
                        <vue-plyr v-if="video.lesson_provider === 'Youtube'" style="height: 500px;">
                            <div class="plyr__video-embed">
                                <iframe
                                    :src="`https://www.youtube.com/embed/${video.video_url}?iv_load_policy=3&modestbranding=1&playsinline=1&showinfo=0&rel=0&enablejsapi=1`"
                                    allowfullscreen allowtransparency allow="autoplay">
                                </iframe>
                            </div>
                        </vue-plyr>

                        <vue-plyr v-else-if="video.lesson_provider === 'Vimeo'">
                            <div class="plyr__video-embed">
                                <iframe
                                    :src="`https://player.vimeo.com/video/${video.video_url}?loop=false&byline=false&portrait=false&title=false&speed=true&transparent=0&gesture=media`"
                                    allowfullscreen allowtransparency allow="autoplay">
                                </iframe>
                            </div>
                        </vue-plyr>

                        <!-- https://www.w3schools.com/html/mov_bbb.mp4 -->
                        <!-- video element -->
                        <vue-plyr v-else-if="video.lesson_provider === 'HTML5'">
                            <video :poster="video.thumbnail" src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer.mp4">
                                <source src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4" type="video/mp4" size="576">
                                <source src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4" type="video/mp4" size="720">
                                <source src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4" type="video/mp4" size="1080">
                                <track kind="captions" label="English" srclang="en" src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer.vtt" default>
                            </video>
                        </vue-plyr>
                    </div>
                   
                </div>

                <!-- // Side bar -->
                <div class="col-lg-3 pr-0 pl-0">
                    <right-sidebar :sections="sections" :lessons="lessons"></right-sidebar>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import RightSidebar from '../../../../../components/courses/enrolled/right_sidebar'
    import Navbar from '../../../../../components/LearningNavbar.vue'

    export default {

        layout: 'learning',

        components: {
            RightSidebar, Navbar
        },

        head() {
            return {
                title: this.course.title
            }
        },

        async asyncData({ params, error }) {
            try {
                let { data } = await axios.get(`/course/${params.slug}/learn/${params.lesson}`)
                return {
                    course: data.courseTitle,
                    sections: data.sections,
                    lessons: data.lessons,
                    video: data.video
                }
            } catch (error) {
                error({ statusCode: 500, message: 'Error'})
            }
        }
    }
</script>

<style scoped>
    .player-height {
        max-height: 500px;
    }

    .player-height {
        height: 400px;
    }
</style>