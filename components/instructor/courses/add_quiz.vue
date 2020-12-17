<template>
    <transition name="fade" mode="out-in">
        <modal :form_action="addQuiz" @keydown="form.onKeydown($event)" header="Add new quiz">

            <template slot="header">
                <h5 class="modal-title">
                    Add New Quiz
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="$emit('close')">
                    <span aria-hidden="true">&times;</span>
                </button>
            </template>

            <template slot="form">
                <div class="modal-body">

                    <alert-error :form="form"><fa icon="exclamation-triangle" fixed-width /> &nbsp; There were some problems with your input.</alert-error>

                    <div class="form-group">
                        <label class="col-form-label">Title</label>
                        <div>
                            <input type="text" name="title" v-model="form.title" :class="{ 'is-invalid' : form.errors.has('title') }" class="form-control rounded" placeholder="Quiz Title">
                            <has-error :form="form" field="title"></has-error>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="instruction" class="col-form-label">Instruction</label>
                        <div>
                            <textarea name="instruction" id="instruction" v-model="form.instruction" cols="30" rows="5" :class="{ 'is-invalid' : form.errors.has('instruction') }" class="form-control rounded"></textarea>
                            <has-error :form="form" field="instruction"></has-error>
                        </div>
                    </div>

                </div>

                <div class="modal-footer">
                    <v-button :loading="form.busy" class="btn-primary rounded btn-sm">Add Quiz</v-button>
                </div>
            </template>
        
        </modal>
    </transition>
</template>

<script>
    import axios from 'axios'
    import Form from 'vform'

    export default {

        name: 'AddQuizMOdal',

        props: ['course_id', 'bank', 'index'],

        data: () => ({
            form: new Form({
                title: '',
                instruction: '',
                course_id: '',
                bank_id: '',
                section_id: ''
            }),
            sections: [],
            isLoading: false
        }),

        created() {
            this.getSections()
        },

        methods: {
            getSections() {
                this.isLoading = true
                axios.get(`/instructor/courses/section/add_quiz/get/${this.course_id}`)
                .then((res) => {
                    this.isLoading = false
                    this.sections = res.data.sections
                })
            },
            
            async addQuiz(event) {
                this.form.bank_id = this.bank.id
                this.form.course_id = this.course_id
                this.form.section_id = this.bank.section_id
                try {
                    const { data } = await this.form.post('/instructor/courses/section/add_quiz/store')

                    this.$swal({
                        type: 'success',
                        text: 'Quiz has been saved'
                    })

                    var quizData = {
                        id: data.id,
                        title: data.title,
                        bank_id: data.bank_id,
                        section_id: data.section_id,
                        course_id: data.course_id,
                        instruction: data.instruction,
                    }

                    this.$emit('close')
                    this.$emit('clicked', quizData)
                } catch (e) {
                    return
                } 
            }
        }
    }
</script>

<style>

</style>