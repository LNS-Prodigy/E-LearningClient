<template>
	<div>
		<div class="jumbotron bg-gradient-default mb-0 rounded-0 pb-0 pt-lg-5">
			<section>
				<div class="container">
					<div>
						<h2 class="text-white">My Courses</h2>
						<ul class="list-unstyled pt-3">
							<li class="d-inline-block mr-4" v-for="tab in tabs" :key="tab.id">
								<router-link :to="{ name: tab.route }" class="page-header text-white">
									{{tab.name}}
								</router-link>
							</li>
						</ul>
					</div>
				</div>
			</section>
		</div>

		<!-- // Main Body -->
		<section class="section-sm">
			<div class="container">

				<div class="filters row">
					<div class="col-lg-4">
						<h6 class="text-muted"><small>Search</small></h6>
						<form class="my-auto d-inline">
							<div class="input-group">
								<input aria-describedby="addon-right addon-left w-25" type="text" name="search" placeholder="Search for courses" class="form-inline form-control">
								<div class="input-group-prepend">
									<span class="input-group-text btn btn-outline-primary rounded-right">
										<fa icon="search" fixed-width />
									</span>
								</div>
							</div>
						</form>
					</div>
				</div>
				
				<div class="mt-4">
					<div v-if="courses.length != 0" class="row">
						<div class="col-lg-3 col-sm-6 item-col-lg-3 mb-4" v-for="(course, index) in courses" :key="index">
							<router-link :to="{ name: 'student.courses.learn', params: { slug: course.slug, lesson_id: course.first_lesson.id } }">
								<div class="card shadow-sm shadow--hover rounded">
									<img :src="course.image" class="card-img-top border-bottom" alt="">
									<div class="card-body py-3">
										<div class="grid-course-name">
											<h6 class="text-capitalize">
												<strong>{{course.title}}</strong>
											</h6>
										</div>
										<p class="small text-dark"><small>{{course.user.name}}</small></p>
										<div v-if="course.has_finished_lesson != null">
											<div class="progress mb-0" style="height: 3px;">
												<div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="progress-bar bg-danger" :style="`width: ${totalPercentage(course)}%;`">
												</div>
											</div>
											<small class="text-muted">{{totalPercentage(course)}}% Complete</small>
											<!-- // If there's a rating -->
											<div v-if="course.rating != null">
												<div>
													<div class="rating your-rating-box" style="position: unset; margin-top: -18px;">
														<star-rating :star-size="15" :inline="true" :read-only="true" :show-rating="false" :increment="0.5" :rating="course.rating.rating"></star-rating>
														<p class="your-rating-text" @click.prevent="openEditRatingModal(course, index)">
															<small>Edit Your Rating</small>
														</p>
													</div>
												</div>
											</div>
											<!-- If no rating -->
											<div v-else>
												<div>
													<div class="rating your-rating-box" style="position: unset; margin-top: -18px;">
														<star-rating :star-size="15" :inline="true" :rating="0" :read-only="true" :show-rating="false"></star-rating>
														<p class="your-rating-text" @click.prevent="openRatingModal(course, index)">
															<small>Leave a rating</small>
														</p>
													</div>
												</div>
											</div>
										</div>
										<div v-else>
											<div class="progress mb-0" style="height: 3px;">
												<div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="progress-bar bg-danger" style="width: 0%;">
												</div>
											</div>
											<small class="text-muted">Start Course</small>
										</div>
									</div>
								</div>
							</router-link>

						</div>
					</div>
					<div v-else>
						<div class="mt-5 text-center">
							<h5>You don't have any Courses yet.</h5>
							<svg width="150" height="150"
                                xmlns="http://www.w3.org/2000/svg">
                                <image xlink:href="https://res.cloudinary.com/dl9phqhv0/image/upload/v1576466812/Online%20Learning%20Icon%20Pack/048-online_learning_rutn2d.svg" width="150" height="150"/>
                            </svg>
                           	<div>
                           		<router-link :to="{ name: 'home' }" class="btn btn-default text-capitalize rounded">
	                            	Start Learning
	                            </router-link>
                           	</div>
						</div>
					</div>
				</div>
			</div>			
		</section>

		<rating-modal v-if="showRatingModal" @close="closeRatingModal" :data="courseData" :index="courseIndex" @clicked="saveNewRating">
		</rating-modal>

		<edit-rating-modal v-if="showEditRatingModal" @close="closeEditRatingModal" :data="courseData" :index="courseIndex" @clicked="saveUpdateRating"></edit-rating-modal>

	</div>
</template>

<script>
	let myBody = null

	import axios from 'axios'
	import { mapGetters } from 'vuex'

	// Modal
	import RatingModal from '~/components/courses/enrolled/rating'
	import EditRatingModal from '~/components/courses/enrolled/edit_rating'

	import StarRating from 'vue-star-rating'

	export default {

		middleware: 'auth',

		components: {
			RatingModal, StarRating, EditRatingModal
		},

		head() {
			return { title: 'My Courses' }
		},

		data: function() {
			return {
				showRatingModal: false,
				showEditRatingModal: false
			}
		},

		async asyncData ({ error }) {
			try {
				let { data } = await axios.get('/student/account/my-courses/learning')
				return {
					courses: data.enrolled_courses
				}
			} catch (e) {
				return
			}
		},
		
		computed: {
			...mapGetters({
				user: 'auth/user'
			}),
			tabs() {
				return [
					{
						name: 'My Courses',
						route: 'student.courses'
					}
				]
			},
		},

		mounted: function () {
            myBody = document.getElementsByTagName('body')[0]
        },

		methods: {
			openRatingModal: function (data, index) {
				this.courseData = data
				this.courseIndex = index
				this.showRatingModal = true

				// Add modal-open to Body tag
				myBody.classList.toggle('modal-open')
			},

			closeRatingModal: function () {
				this.showRatingModal = false
				myBody.classList.remove('modal-open')
			},

			saveNewRating: function (value) {
				this.$set(this.courses[value.index], 'rating', value)
			},

			// Edit Rating Modal
			openEditRatingModal: function (data, index) {
				this.courseData = data
				this.courseIndex = index
				this.showEditRatingModal = true

				// Add Modal-open to body tag
				myBody.classList.toggle('modal-open')
			},

			closeEditRatingModal: function () {
				this.showEditRatingModal = false
				myBody.classList.remove('modal-open')
			},

			saveUpdateRating: function (value) {
				this.$set(this.courses[value.index], 'rating', value)
			},


			totalPercentage: function (course) {
				return parseInt((course.progress_count / course.lessons_count) * 100)
			}

		},

	}

</script>

<style lang="scss" scoped>
	.jumbotron {
		padding-top: 2rem;
		padding-left: 2rem;
		padding-right: 2rem;
	}

	.page-header {
		padding: 0 0 5px;
		border-bottom: 6px solid hsla(0, 0%, 100%, 0);
		color: #fff;
		display: block;
	}

	.router-link-active {
		border-bottom: 5px solid red;
		cursor: text;
	}

	.page-header:hover {
		color: white;
		border-bottom: 5px solid red;
	}

	.your-rating-box {
		position: absolute;
	    right: 10px;
	    bottom: 3px;
	    margin-bottom: 0;
	    z-index: 1;
	    text-align: right;
	}
	.your-rating-text {
		margin-bottom: 0;
	    font-size: 13px;
	    color: #29303b;
	    margin-top: 2px;
	}
</style>