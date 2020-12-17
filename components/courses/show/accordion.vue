<template>
    <div class="mt-5 course-curriculum-box">
        <div class="course-curriculum-title clearfix">
            <div class="float-left">
                <h4>Curriculum for this course</h4>
            </div>
            <div class="float-right m-t-5">
                <span class="total-lectures">
                    {{countLessons}} Lessons
                </span>
                <span class="total-time">
                    {{duration}} Hours
                </span>
            </div>
        </div>
        <div class="accordion course__curriculum-accordion" id="accordionExample">
            <div class="card border-0 lecture__group-wrapper bg-transparent" v-for="(section, index) in sections" :key="index">
                <div class="" id="headingOne">
                    <div class="lecture__group-title clearfix mb-0" data-toggle="collapse" :data-target="`#collapse-${index}`" :aria-expanded="index == 0 ? 'true' : 'false'" aria-controls="collapseOne">
                        <div class="title float-left">
                            <button class="btn btn-link text-capitalize text-dark" type="button">
                                <span class="w-25">{{section.title}}</span>
                            </button>
                        </div>
                        <!-- // Lesson Data -->
                        <div class="float-right">
                            <span class="total-lectures d-inline-block" style="padding: 0.625rem 1.25rem;" >
                                {{section.lessons.length}} Lessons
                            </span>
                            <span class="total-time d-inline-block">
                                 Hours
                            </span>
                        </div>
                    </div>
                </div>

                <div :id="`collapse-${index}`" class="collapse" :class="{ 'show' : index == 0 }" aria-labelledby="headingOne" data-parent="#accordionExample">
                    <div class="card-body p-0 border bg-white">
                        <div class="lecture-list">
                            <ul class="list-unstyled mb-0">
                                <template v-for="(lesson, index) in lessons">
                                    <li v-if="lesson.course_section_id == section.id" :key="`${index}-lesson`" class="lecture has-preview">
                                        <span class="lecture-title">{{lesson.title}}</span>
                                        <span class="lecture-time float-right">{{lesson.duration}}</span>
                                    </li>
                                </template>
                                <template v-for="(quiz, index) in quizzes">
                                    <template v-for="(bolt, index) in quiz.quizzes">
                                        <li v-if="bolt.section_id == section.id" :key="`${index}-quiz`" class="lecture lecture-quiz has-preview">
                                            <span class="lecture-title">{{quiz.title}}</span>
                                        </li>
                                    </template>
                                </template>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    let myBody = null

    export default {

        props: [
            'sections', 'lessons', 'duration', 'countLessons', 'quizzes'
        ],

    }
</script>

<style>

</style>
