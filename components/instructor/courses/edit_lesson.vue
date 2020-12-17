<template>
	<transition name="fade" mode="out-in">
		<modal :form_action="editLesson" @keydown="form.onKeydown($event)" header="Edit Lesson">
			<!-- // Header -->
			<template slot="header">
				<h5 class="modal-title">Edit Lesson</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="close" @click="$emit('close')">
					<span aria-hidden="true">&times;</span>
				</button>
			</template>

			<!-- // Body -->
			<template slot="form">
				<div class="modal-body">

					<!-- // Lesson Title -->
                    <div class="form-group">
                        <label for="title" class="col-form-label">Title</label>
                        <input type="text" name="title" v-model="form.title" :class="{ 'is-invalid' : form.errors.has('title') }" class="form-control rounded">
                        <has-error :form="form" field="title"></has-error>
                    </div>

					<!-- // Section  -->
                    <div class="form-group">
                        <label for="course_section_id" class="col-form-label">Section</label>
                        <select name="course_section_id" id="course_section_id" v-model="form.course_section_id" :class="{ 'is-invalid' : form.errors.has('course_section_id') }" class="custom-select rounded">
                            <option value="" selected>Select Section</option>
                            <option :value="section.id" v-for="(section, index) in sections" :key="index" >
                                {{section.title}}
                            </option>
                        </select>
                        <has-error :form="form" field="course_section_id" />
                    </div>

                    <!-- // Lesson Type -->
                    <div class="form-group">
                        <label for="lesson_type" class="col-form-label">Lesson Type</label>
                        <select name="lesson_type" id="lesson_type" v-model="form.lesson_type" :class="{ 'is-invalid' : form.errors.has('lesson_type') }" class="custom-select rounded">
                            <option value="">Select Lesson Type</option>
                            <option :value="type.value" v-for="type in lessonTypes" :key="type.id">
                                {{type.name}}
                            </option>
                        </select>
                        <has-error :form="form" field="lesson_type"></has-error>
                    </div>

                    <template v-if="form.lesson_type === 'VIDEO'">
                        <!-- // Lesson Provider -->
                        <div class="form-group">
                            <label for="lesson_provider" class="col-form-label">Lesson Provider</label>
                            <select name="lesson_provider" id="lesson_provider" v-model="form.lesson_provider" :class="{ 'is-invalid' : form.errors.has('lesson_provider') }" class="custom-select rounded">
                                <option value="">Select Provider</option>
                                <option v-for="(item, key) in lessonProvider" :key="key" :value="item.value">{{item.name}}</option>
                            </select>
                            <has-error :form="form" field="lesson_provider"></has-error>
                        </div>

                        <!-- // Video URL -->
                        <div class="form-group">
                            <label for="video_url" class="col-form-l">Video URL</label>
                            <template v-if="form.lesson_provider === 'HTML5'">
                                <input type="file" name="video_url" @change="selectFileVideo" accept="video/*" id="">
                            </template>
                            <template v-else>
                                <input type="text" name="video_url" v-model="form.video_url" :class="{ 'is-invalid' : form.errors.has('video_url') }" class="form-control">
                                <span class="text-muted small" v-if="form.lesson_provider === 'Youtube'">
                                    Copy the link that is highlighted ex: https://www.youtube.com/watch?v=<span class="text-success" style="background-color: yellow;">qgLazBJm9h0</span>
                                </span>
                                <span class="text-muted small" v-if="form.lesson_provider === 'Vimeo'">
                                    Copy the link that is highlighted ex: https://vimeo.com/<span class="text-success" style="background-color: yellow;">227956054</span>
                                </span>
                            </template>
                            <has-error :form="form" field="video_url"></has-error>
                        </div>

                        <!-- // Thumbnail if HTML5 -->
                        <div class="form-group" v-if="form.lesson_provider === 'HTML5'">
                            <label for="thumbnail" class="col-form-label">Thumbnail</label>
                            <input type="file" name="thumbnail" @change="selectFileThumbnail" class="form-control" id="">
                        </div>

                        <!-- // Video Duration  -->
                        <div class="form-group">
                            <label for="duration" class="col-form-label">Duration</label>
                            <flat-pickr :config="config.timePicker"
                                            class="form-control"
                                            v-model="form.duration"
                                            placeholder="Duration">
                            </flat-pickr>

                            <has-error :form="form" field="duration"></has-error>
                        </div>
                    </template>

					<template v-if="form.lesson_type === 'TFILE'">
                        <div class="form-group">
							<label for="Text" class="col-form-label">Text</label>
                            <textarea name="text_file" id="text_file" cols="30" rows="10" v-model="form.text_file" class="form-control" :class="{ 'is-invalid' : form.errors.has('text_file') }"></textarea>
                            <div class="form-group">
                                <label for="attachment" class="col-form-label">Attachment</label>
                                <input type="file" name="lesson_attachment" @change="selectFileAttachment" class="form-control" id="">
                            </div>
                        </div>
                    </template>

                    <template v-if="form.lesson_type === 'PDF' || form.lesson_type === 'DF' || form.lesson_type === 'IFILE'">
                        <div class="form-group">
                            <label for="attachment" class="col-form-label">Attachment</label>
                            <input type="file" name="lesson_attachment" @change="selectFileAttachment" class="form-control" id="">
                        </div>
                    </template>

					<div class="form-group">
                        <label for="summary" class="col-form-label">Summary</label>
                        <textarea name="summary" id="summary" cols="30" rows="3" :class="{ 'is-invalid' : form.errors.has('summary') }" class="form-control rounded" v-model="form.summary"></textarea>
                        <has-error :form="form" field="summary"></has-error>
                    </div>
				</div>

				<div class="modal-footer">
                    <v-button :loading="form.busy" class="btn-primary rounded btn-sm">Add Lesson</v-button>
                </div>
			</template>
		</modal>
	</transition>
</template>

<script>
	import axios from 'axios'
	import Form from 'vform'

	if (process.client) {
        let objectToFormData = document.createElement('script')
        objectToFormData.setAttribute('src', "https://cdn.rawgit.com/cretueusebiu/412715093d6e8980e7b176e9de663d97/raw/aea128d8d15d5f9f2d87892fb7d18b5f6953e952/objectToFormData.js")
        document.head.appendChild(objectToFormData)
    }

	export default {
		name: 'EditLesson',

		props: ['data', 'index', 'sections'],

		data: function () {
			return {
				lesson: [],

				form: new Form({
					title: '',
					lesson_image: '',
					lesson_type: '',
					lesson_provider: '',
					course_section_id: '',
					thumbnail: '',
					video_url: '',
					duration: '',
					lesson_attachment: '',
					summary: '',
					text_file: ''
				}),

				config: {
					timePicker: {
						wrap: true,
						enableTime: true,
						enableSeconds: true,
						noCalendar: true,
						time_24hr: true,
						timeFormat: "H:i:s"
					}
				}

			}
		},

		created() {
			this.getLesson()
		},

		computed: {
			lessonTypes: function () {
				return [
					{
                        value: 'VIDEO',
                        name: 'Video URL'
                    },
                    {
                        value: 'TFILE',
                        name: 'Text File'
                    },
                    {
                        value: 'PDF',
                        name: 'PDF File'
                    },
                    {
                        value: 'DF',
                        name: 'Document File'
                    },
                    {
                        value: 'IFILE',
                        name: 'Image File'
                    }
				]
			},

			lessonProvider: function () {
				return [
					{
                        value: 'Youtube',
                        name: 'Youtube'
                    },
                    {
                        value: 'Vimeo',
                        name: 'Vimeo'
                    },
                    {
                        value: 'HTML5',
                        name: 'HTML5'
                    }
				]
			}
		},

		methods: {
			// Get Lesson
			async getLesson() {
				await axios.get(`/instructor/courses/section/edit_lesson/get/${this.data.id}`)
				.then((res) => {
					this.lesson = res.data.lesson
					this.form.fill(this.lesson)
				}).catch((err) => {
					console.log(err)
				})
			},

			selectFileAttachment(e) {
                const file = e.target.files[0]
                this.form.lesson_attachment = file
            },

			async editLesson () {
				let { data } = await this.form.patch(`/instructor/courses/section/edit_lesson/patch/${this.data.id}`)

				this.$swal({
					toast: true,
					position: 'bottom-end',
					timer: 3000,
					showConfirmButton: false,
					type: 'success',
					text: data.message
				})

				var newLessonData = {
                    course_section_id: data.lesson.course_section_id,
                    lesson_image: data.lesson.lesson_image,
                    title: data.lesson.title,
                    lesson_type: data.lesson.lesson_type,
                    lesson_provider: data.lesson.lesson_provider,
                    thumbnail: data.lesson.thumbnail,
                    video_url: data.lesson.video_url,
                    duration: data.lesson.duration,
                    lesson_attachment: data.lesson.lesson_attachment,
                    summary: data.lesson.summary,
                    id: data.lesson.id,
                    index: this.index
				}

				// Close window
				this.$emit('close')
				this.$emit('clicked', newLessonData)
			}
		}

	}

</script>

<style lang="scss" scoped>

</style>
