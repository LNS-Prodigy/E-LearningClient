<template>
	<div>
		<div v-if="!addQuestion">
			
			<div class="form-group">
				<form class="my-auto d-inline w-25">
					<div class="input-group">
						<input aria-describedby="addon-right addon-left" type="text" name="search" placeholder="Search for solutions" class="form-inline form-control">
						<div class="input-group-prepend">
							<span class="input-group-text rounded-right btn btn-danger shadow-none">
								<fa icon="search" fixed-width />
							</span>
						</div>
					</div>
				</form>
			</div>

			<a v-if="user.id != teacherId" href="#" class="float-right" @click.prevent="showAddQuestionForm">
				<span v-if="!addQuestion">
					Ask a new question
				</span>
				<span v-else>
					Back to All Questions
				</span>
			</a>

			<h6 class="font-weight-600">{{ qnas.length }} questions in this course</h6>
			
			<hr class="mt-3 mb-0">
		</div>
		
		<div v-if="!addQuestion">
			<div v-if="qnas.length != 0">
				<router-link :to="{ name: 'student.courses.learn.qna.reply', params: { id: qna.id } }" v-for="(qna, key) in orderedQnas" :key="key">
					<div class="comment">
						<div class="comment__header">
							<div class="d-inline-flex">
								<div>
									<img v-if="qna.user.avatar == 'users/default.png'" :src="qna.user.photo_url" class="rounded-circle mr-1" height="40" width="40" alt="">
									<client-only v-else>
										<cld-image :publicId="`${qna.user.avatar_public_id}.png`" class="mr-1 profile-photo" alt="">
											<cld-transformation height="40" width="40" crop="fill" radius="100" />
										</cld-image>
									</client-only>
								</div>
								<!-- // details -->
								<div>
									<div class="ml-4 mt-1">
										<div>
											<div>
												<h6 class="font-weight-600 text-capitalize text-dark">
													{{ qna.title }} &nbsp; 
													<span v-if="qna.answered != 1" class="badge badge-dark">No Answer</span>
													<span v-else class="badge badge-success">Answered</span>
												</h6>
												<div v-html="qna.details" class="text-dark">
													{{ qna.details }}
												</div>
											</div>
										</div>
									</div>
									<div class="ml-4">
										<p class="text-dark mb-0 small">
											<small>
												{{ qna.user.name }} &middot; {{ qna.created_at | moment("from", "now") }} &nbsp; &middot; &nbsp; <span class="text-muted">
													0 <fa icon="arrow-up" fixed-width /> &middot; {{ qna.replies.length }} <fa icon="comments" fixed-width /> 
												</span>
											</small>
										</p>
									</div>

								</div>

							</div>
						</div>
					</div>
				</router-link>

				<!-- <div class="d-block">
                    <div>
                        <pagination class="justify-content-center mt-4" :data="qnas" @pagination-change-page="page" :showDisabled="true" :limit="5" align="center"></pagination>
                    </div>
                </div> -->
			</div>
			<div v-else>
				<!-- // No Questions -->
				<div class="text-center">
					<div class="mt-5 text-center">
						<h5 class="mb-4">Do you guys have any questions?</h5>
						<svg width="150" height="150"
                        	xmlns="http://www.w3.org/2000/svg">
                        	<image xlink:href="https://res.cloudinary.com/dl9phqhv0/image/upload/v1576466799/Online%20Learning%20Icon%20Pack/016-search_jut7qz.svg" width="150" height="150"/>
                        </svg>
					</div>
				</div>
			</div>
		</div>

		<div v-else>
			
			<div class="row justify-content-center mt-3">
				<div class="col-lg-10">
					<button type="button" class="btn btn-outline-default text-capitalize" @click.prevent="showAddQuestionForm">
						Back to all Questions
					</button>
					<div class="p-3 bg-secondary border mt-3">
						<h6 class="text-dark font-weight-600">Tips on getting your question answered faster</h6>
						<ul>
							<li>Search to see if your question has been asked before</li>
							<li>Be detailed; provide screenshots, error messages, code, or other clues whenever possible</li>
							<li>Check grammar and spelling</li>
						</ul>
					</div>

					<form @submit.prevent="save" @keydown="form.onKeydown($event)">
				
						<div class="form-group">
							<label for="title" class="col-form-label">Title <span class="text-danger">*</span></label>
							<div>
								<input type="text" name="title" :class="{ 'is-invalid' : form.errors.has('title') }" v-model="form.title" class="form-control rounded" placeholder="e.g: Why do we need that?"></input>
								<has-error :form="form" field="title"></has-error>
							</div>
						</div>

						<div class="form-group">
							<label for="details" class="col-form-label">Details</label>
							<div>
								<textarea name="details" id="details" cols="30" rows="5" v-model="form.details" :class="{ 'is-invalid' : form.errors.has('details') }" class="form-control"></textarea>
								<has-error :form="form" field="details"></has-error>
							</div>
						</div>

						<v-button :loading="form.busy" class="btn-block riybded">
							Send Question
						</v-button>

					</form>
				</div>
			</div>

		</div>

	</div>
</template>

<script>
	import Form from 'vform'
	import _ from 'lodash'
	import { mapGetters } from 'vuex'
	import axios from 'axios'
	import Pagination from 'laravel-vue-pagination'

	export default {

		components: {
			Pagination
		},

		name: 'QuestionsAndAnswers',

		data: function () {
			return {
				addQuestion: false,
				form: new Form({
					title: '',
					details: '',
					course_id: ''
				}),
				config: {
					// Froala config here
				}
			}
		},

		async asyncData({ params, error }) {
			try {
				let { data } = await axios.get(`/student/account/my-courses/learning/${params.slug}/show/qanda`)
				return {
					qnas: data.qnas,
					courseId: data.courseId,
					teacherId: data.teacherId,
					slug: data.slug
				}
			} catch (e) {
				console.log(e)
			}
		},

		methods: {
			showAddQuestionForm: function () {
				this.addQuestion = !this.addQuestion
			},

			async save () {
				try {
					this.form.course_id = this.courseId

					let { data } = await this.form.post('/student/account/my-courses/learning/qanda/store')

					// show success
					this.$swal({
						toast: true,
						position: 'bottom-end',
						showConfirmButton: false,
						timer: 5000,
						type: 'success',
						text: data.message
					})

					this.qnas.push({
						id: data.newValue.id,
						parent_id: data.newValue.parent_id,
						user_id: data.newValue.user_id,
						course_id: data.newValue.course_id,
						title: data.newValue.title,
						details: data.newValue.details,
						user: data.user,
						replies: [],
						created_at: data.newValue.created_at,
						updated_at: data.newValue.updated_at
					})

					this.addQuestion = false

					this.form.title = '',
					this.form.details = ''	
				} catch (e) {
					return
				}
			},

			loadMore: function () {
				this.qnas++
			}

		},

		computed: {
			orderedQnas: function () {
				return _.orderBy(this.qnas, ['created_at'], ['desc'])
			},

			...mapGetters({
				user: 'auth/user'
			})
		}

	}

</script>

<style lang="scss" scoped>
	.comment {
		padding: 1rem;
		border-top: 1px solid #e8e9eb;
	}

	.comment:hover {
		background-color: #f7f8fa;
	}
</style>