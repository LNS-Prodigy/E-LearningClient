<template>
    <transition name="fade" mode="out-in">
        <modal :form_action="addQuizbank" @keydown="form.onKeydown($event)" header="add new quiz bank">
            <template slot="header">
                <h5 class="modal-title">Add new Quiz Bank</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="close" @click="$emit('close')">
                    &times;
                </button>
            </template>

            <!-- // Form -->
            <template slot="form">
                <div class="modal-body">
                    
                    <alert-error :form="form" message="Something went wrong! Please try again."></alert-error>

                    <!-- // Sections -->
                    <div class="form-group">
                        <label class="col-form-label">Section <span class="text-danger">*</span></label>
                        <select name="section_id" id="section_id" v-model="form.section_id" :class="{ 'is-invalid' : form.errors.has('section_id') }" class="form-control custom-select rounded">
                            <option value="">Select Section</option>
                            <option v-for="section in sections" :key="section.id" :value="section.id">{{ section.title }}</option>
                        </select>
                        <has-error :form="form" field="section_id"></has-error>
                    </div>

                    <!-- // Number of quizzes to display -->
                    <div class="form-group">
                        <label for="number_of_questions" class="col-form-label">Number of Questions <span class="text-danger">*</span></label>
                        <div>
                            <input type="number" :class="{ 'is-invalid' : form.errors.has('number_of_questions') }" v-model="form.number_of_questions" class="form-control rounded">
                            <has-error :form="form" field="number_of_questions"></has-error>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <v-button :loading="form.busy" class="btn btn-primary rounded btn-sm">Save quiz bank</v-button>
                </div>
            </template>

        </modal>
    </transition>
</template>

<script>
    import axios from 'axios'
    import Form from 'vform'

    export default {

        name: 'AddQuizbankModal',

        props: ['course_id', 'sections'],

        data: function () {
            return {
                form: new Form({
                    course_id: '',
                    section_id: '',
                    number_of_questions: ''
                })
            }
        },

        methods: {
            async addQuizbank () {
                this.form.course_id = this.course_id
                try {
                    let { data } = await this.form.post(`/instructor/courses/section/add_quiz_bank/post`)

                    this.$swal({
                        toast: true,
                        position: 'bottom-end',
                        timer: 3000,
                        showConfirmButton: false,
                        type: 'success',
                        text: data.message
                    })

                    var newQuizBank = {
                        id: data.bank.id,
                        course_id: data.bank.course_id,
                        section_id: data.bank.section_id,
                        number_of_questions: data.bank.number_of_questions,
                        created_at: data.bank.created_at,
                        updated_at: data.bank.updated_at
                    }

                    this.$emit('close')
                    this.$emit('clicked', newQuizBank)

                } catch (e) {
                    return
                }
            }
        }

    }

</script>

<style lang="scss" scoped>

</style>