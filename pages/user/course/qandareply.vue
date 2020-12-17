<template>
	<div>

		<div>
			<router-link :to="{ name: 'student.courses.learn.qanda', params: { slug: slug } }" class="btn btn-outline-default text-capitalize">
				Back to All Questions
			</router-link>
		</div>

		<hr class="my-3">
		<!-- // Comment to Answer -->
		<div class="mt-3">
			<div class="d-inline-flex">
		
				<!-- // Commenter Image  -->
				<div>
					<!-- // Cloudinary Image if Exists -->
					<img v-if="qna.user.avatar == 'users/default.png'" :src="qna.user.photo_url" class="rounded-circle mr-1" height="50" width="50" alt="">
					<client-only v-else>
						<cld-image :publicId="`${qna.user.avatar_public_id}.png`" class="mr-1 profile-photo" alt="">
							<cld-transformation height="50" width="50" crop="fill" radius="100" />
						</cld-image>
					</client-only>
				</div>

				<!-- // details -->
				<div>
					<div class="ml-4 mt-2">
						<div>
							<div>
								<h6 class="font-weight-600 text-capitalize">
									{{ qna.title }} &nbsp; 
									<span v-if="qna.answered != 1" class="badge badge-dark">
										No Answer
									</span>
									<span v-else class="badge badge-success">Answered</span>
									<span v-if="user.id == qna.user_id && qna.answered != 1" class="text-success" @click.prevent="markAsAnswered" style="cursor: pointer;">
										<fa icon="check" fixed-width />
									</span>
								</h6>
								<div v-html="qna.details" class="text-dark">
									{{ qna.details }}
								</div>
							</div>
						</div>
					</div>

					<!-- // Comment User Details -->
					<div class="mt-4 ml-4">
						<p class="text-dark mb-0 small">
							<small>
								{{ qna.user.name }} &middot; {{ qna.created_at | moment("from", "now") }} &nbsp; &middot; &nbsp; <span class="text-muted">
									0 <fa icon="arrow-up" fixed-width />
								</span>
							</small>
						</p>
					</div>

				</div>
			</div>
		</div>

		<div class="mt-5">
			<h5 class="font-weight-600">{{ replies.length }} 
				<span v-if="replies.length < 2">reply</span>
				<span v-else-if="replies.length > 1">replies</span>
			</h5>
			<hr class="mt-3 mb-0">

			<!-- // Replies -->
			<div v-if="replies.length != 0">
				<div class="comment" v-for="(reply, key) in replies" :key="key">
					<div class="d-inline-flex">
						<!-- // User Answered Image -->
						<div>
							<img v-if="reply.user.avatar == 'users/default.png'" :src="reply.user.photo_url" class="rounded-circle mr-1" height="50" width="50" alt="">
							<client-only v-else>
								<cld-image :publicId="`${reply.user.avatar_public_id}.png`" class="mr-1 profile-photo" alt="">
									<cld-transformation height="50" width="50" crop="fill" radius="100" />
								</cld-image>
							</client-only>
						</div>
						<!-- // Answer Details -->
						<div>
							<div class="ml-4 mt-2">
								<div>
									<div>
										<h6 class="font-weight-600 text-capitalize mb-0">
											{{ reply.user.name }}
										</h6>
										<div>
											<small class="text-muted">{{ reply.created_at | moment("from", "now") }}</small>
										</div>
										<p class="text-dark mt-3">
											{{ reply.details }}
										</p>
									</div>
								</div>
								<div class="mt-4">
									<p class="text-dark mb-0 small">
										<small>
											<span class="text-muted">0 <fa icon="arrow-up" fixed-width /></span>
										</small>
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- // Reply to Question -->
			<div v-if="!addAnswer" class="comment">
				<div class="d-inline-flex">
					<div>
						<img v-if="user.avatar == 'users/default.png'" :src="user.photo_url" class="rounded-circle mr-1" height="50" width="50" alt="">
						<client-only v-else>
							<cld-image :publicId="`${user.avatar_public_id}.png`" class="mr-1 profile-photo" alt="">
								<cld-transformation height="50" width="50" crop="fill" radius="100" />
							</cld-image>
						</client-only>
					</div>
					<div>
						<input type="text" placeholder="Add Reply" class="form-control ml-3" @click="toggleAddAnswer">
					</div>
				</div>
			</div>

			<div v-else class="comment">
				<form @submit.prevent="save" @keydown="form.onKeydown($event)">
					<div class="form-group">
						<label class="col-form-label">Answer: </label>
						<textarea name="details" id="details" :class="{ 'is-invalid' : form.errors.has('details') }" cols="30" rows="4" v-model="form.details" class="form-control"></textarea>
						<has-error :form="form" field="details"></has-error>
					</div>
		
					<button v-if="form.details == ''" type="button" disabled class="btn btn-default text-capitalize">
						Send Answer
					</button>

					<v-button v-else :loading="form.busy" class="text-capitalize rounded">
						Send Answer
					</v-button>
				</form>
			</div>

		</div>

	</div>
</template>

<script>
	import axios from 'axios'
	import Form from 'vform'

	import { mapGetters } from 'vuex'

	export default {
	
		data: function () {
			return {
				form: new Form({
					details: '',
				}),

				addAnswer: false
			}
		},

		async asyncData({ params, error }) {
			try {
				let { data } = await axios.get(`/student/account/my-courses/learning/${params.id}/reply/qanda`)
				return {
					qna: data.qna,
					slug: params.slug,
					replies: data.replies
				}	
			} catch (e) {
				console.log(e)
				return
			}
		},

		methods: {
			toggleAddAnswer: function () {
				this.addAnswer = !this.addAnswer
			},

			async save () {
				try {
					let { data } = await this.form.post(`/student/account/my-courses/learning/${this.qna.id}/reply/save`)
					// show success
					this.$swal({
						toast: true,
						position: 'bottom-end',
						showConfirmButton: false,
						timer: 5000,
						type: 'success',
						text: data.message
					})

					this.replies.push({
						id: data.newValue.id,
						parent_id: data.newValue.parent_id,
						user_id: data.newValue.user_id,
						course_id: data.newValue.course_id,
						title: data.newValue.title,
						details: data.newValue.details,
						user: data.user,
						created_at: data.newValue.created_at,
						updated_at: data.newValue.updated_at
					})

					this.form.details = ''

					this.addAnswer = false
				} catch (e) {
					return
				}
			},

			async markAsAnswered () {
				let { data } = await this.form.patch(`/student/account/my-courses/learning/${this.qna.id}/reply/answered`)
				this.$swal({
					type: 'success',
					text: data.message
				})
				this.qna.answered = 1
			}
		},

		computed: mapGetters({
			user: 'auth/user'
		})

	}

</script>

<style lang="scss" scoped>
	.comment {
		padding: 1rem;
		border-top: 1px solid #e8e9eb;
	}
</style>