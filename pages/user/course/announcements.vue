<template>
	<div>
		<!-- Show Announcement -->
		<div v-if="!createAnnouncement">
			<div v-if="announcements.length != 0">
				<!-- // Announcements -->
				<div>
					<div>
						<div class="d-block" v-for="(ann, key) in announcements" :key="key">
							<!-- // Announcement Header -->
							<div class="d-inline-flex">
								<div>
									<img v-if="ann.user.avatar == 'users/default.png'" :src="ann.user.photo_url" class="rounded-circle mr-1" height="64" width="64" alt="">
									<client-only v-else>
										<cld-image :publicId="`${ann.user.avatar_public_id}.png`" class="mr-1 profile-photo" alt="">
											<cld-transformation height="64" width="64" crop="fill" radius="100" />
										</cld-image>
									</client-only>
								</div>
								<div class="ml-3 mt-2">
									<h6 class="mb-0 font-weight-600">{{ ann.user.name }}</h6>
									<p>posted an announcement &middot; {{ ann.created_at | moment("from", "now") }}</p>
								</div>
							</div>
							<!-- // Announcement Body -->
							<div class="mt-3">
								<h5>{{ ann.title }}</h5>
								<div class="mt-4" v-html="ann.description">
									{{ ann.description }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-else>
				<!-- // No Questions -->
				<div class="text-center">
					<div class="mt-5 text-center">
						<h5 class="mb-4">No announcements from our teacher yet?</h5>
						<svg width="150" height="150"
	                        	xmlns="http://www.w3.org/2000/svg">
	                        <image xlink:href="https://res.cloudinary.com/dl9phqhv0/image/upload/c_scale,h_150/v1576466811/Online%20Learning%20Icon%20Pack/045-microphone_xtnfjy.svg" width="150" height="150"/>
	                    </svg>
	                    <div v-if="user.id == teacherId " class="mt-3">
	                    	<button type="button" class="btn btn-default text-capitalize" @click.prevent="toggleAnnouncement">
		                    	Create an Announcment
		                    </button>
	                    </div>
					</div>
				</div>
			</div>
		</div>
		<!-- Create New Announcement -->
		<div v-else>
			<form @submit.prevent="save" @keydown="form.onKeydown($event)">
				<div class="row justify-content-center">
					<div class="col-lg-7">
						<!-- // Title -->
						<div class="form-group">
							<label class="col-form-label" for="title">Title <span class="text-danger">*</span></label>
							<div>
								<input name="title" v-model="form.title" :class="{ 'is-invalid' : form.errors.has('title') }" class="form-control" placeholder="Title of your Announcement"></input>
								<has-error :form="form" field="title"></has-error>
							</div>
						</div>

						<!-- // Description -->
						<div class="form-group">
							<label for="description" class="col-form-label">Description <span class="text-danger">*</span></label>
							<div>
								<client-only>
	                                <froala id="edit" name="description" :tag="'textarea'" :config="config" :class="{ 'is-invalid' : form.errors.has('description') }" v-model="form.description"></froala>
	                                <has-error :form="form" field="description"></has-error>
	                            </client-only>
							</div>
						</div>

						<v-button :loading="form.busy" class="text-capitalize rounded">
							Save Announcement
						</v-button>

					</div>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import Form from 'vform'

	// User Authenticated
	import { mapGetters } from 'vuex'

	export default {
		
		name: 'CourseAnnouncements',

		data: function () {
			return {
				form: new Form({
					title: '',
					description: ''
				}),

				createAnnouncement: false,

				config: {
					// Enter froala config here
            	},
			}
		},

		computed: mapGetters({
			user: 'auth/user'
		}),

		async asyncData({ params, error }) {
			try {
				let { data } = await axios.get(`/student/account/my-courses/learning/${params.slug}/show/announcements`)
				return {
					announcements: data.announcements,
					teacherId: data.courseTeacher
				}
			} catch (e) {
				return
			}
		},

		methods: {
			toggleAnnouncement: function() {
				this.createAnnouncement = !this.createAnnouncement
			},

			async save() {
				try {
					let { data } = await this.form.post(`/student/account/my-courses/learning/${this.$route.params.slug}/save/announcement`)

					// Notification
					this.$swal({
						type: 'success',
						text: data.message
					})

					// Push new data
					this.announcements.push({
						id: data.newValue.id,
						course_id: data.newValue.course_id,
						user_id: data.newValue.user_id,
						user: data.user,
						title: data.newValue.title,
						description: data.newValue.description,
						created_at: data.newValue.created_at,
						updated_at: data.newValue.updated_at
					})

					// Reset Form
					this.createAnnouncement = false

					this.form.title = ''
					this.form.description = ''
				} catch (e) {
					console.log(e)
					return
				}
			}
		}

	}

</script>

<style lang="scss" scoped>

</style>