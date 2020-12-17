<template>
	<div>
		<client-only>
			<offline-alert/>
		</client-only>
		<!-- jumbotron -->
		<div class="jumbotron bg-image mb-0 rounded-0">
			<section class="section-sm">
				<div class="container">
					<!-- // Slogan -->
					<div class="row row-grid align-items-end">
						<div class="col-lg-6">
							<h1 class="display-3 text-white">
								Unlock Opportunity
							</h1>
							<h6 class="lead text-white mb-0">
								Study any topic, anytime. Explore thousands of courses for the lowest price ever!
							</h6>
						</div>
					</div>
				</div>
			</section>
		</div>

		<div class="section-sm">
			<div class="container">
				<div v-if="enrolled_courses.length != 0">
					<!-- // Welcome Back -->
					<h4 class="font-weight-bold">Welcome Back, {{ user.name }}</h4>
					<p>Ready to jump back in? <router-link :to="{ name: 'student.courses' }" class="float-right">My Courses</router-link> </p>
					<div class="mt-4 mb-5">
						<carousel v-if="enrolled_courses.length != 0" :perPage="2" :loop="true" :paginationEnabled="false" :mouse-drag="false" :autoWidth="true" :autoHeight="true" :center="true" :navigationEnabled="true" navigationNextLabel="&rsaquo;" navigationPrevLabel="&lsaquo;">
							<slide v-for="(encourse, index) in enrolled_courses" :key="index" class="pb-4">
								<div>
									<div>
										<router-link :to="{ name: 'student.courses.learn', params: { slug: encourse.slug, lesson_id: encourse.first_lesson.id } }">
											<div class="shadow-sm shadow--hover rounded bg-white">
												<div class="row justify-content-between">
													<div class="col-lg-5">
														<img :src="encourse.image" class="card-img-top border-bottom" alt="">
													</div>
													<div class="col-lg-7">
														<div class="encourse-title pt-3">
															<p class="font-weight-600 medium text-dark mb-0">{{ encourse.title }}</p>
														</div>
														<div class="tiny-course">
															<span v-if="encourse.course_duration.total_time != '00:00:00'" class="small">
																{{ encourse.course_duration.total_time | duration("humanize") }}
																<!-- <span v-if="encourse.first_progress.status != 1">&middot; Get Started</span>
																<span v-else>Left</span> -->
															</span>
															<span v-else>Finished <fa icon="check-circle" fixed-width class="text-success" /></span>
														</div>
													</div>
												</div>
												<template v-if="encourse.has_finished_lesson != null">
													<div class="progress mb-0 rounded-0" style="height: 7px;">
														<div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="progress-bar bg-gradient-info" :style="`width: ${totalPercentage(encourse)}%;`">
														</div>
													</div>
												</template>
												<template v-else>
													<div class="progress mb-0 rounded-0" style="height: 7px;">
														<div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="progress-bar bg-gradient-info" :style="`width: ${totalPercentage(encourse)}%;`">
														</div>
													</div>
												</template>
											</div>
										</router-link>
									</div>
								</div>
							</slide>
						</carousel>
					</div>
				</div>

				<!-- // Top Courses -->
				<h4>Top Courses</h4>
				<div class="mt-4">
					<div class="row">
						<div class="col-lg-3 col-sm-6 item-col-lg-3 mb-4" v-for="course in courses" :key="course.id">
							<router-link :to="{ name: 'course.show', params: { slug: course.slug } }">
								<div class="card shadow-sm shadow--hover card-lift--hover rounded">
									<img :src="course.image" class="card-img-top border-bottom" alt="">
									<div class="card-body py-3">
										<div class="grid-course-name">
											<h6 class="text-capitalize">
												<strong>{{course.title}}</strong>
											</h6>
										</div>
										<p class="mt-1 mb-1 small text-muted">{{course.user.name}}</p>
										<div class="rating-stars">
											<span class="rating-star-container">
												<star-rating :star-size="15" :inline="true" :read-only="true" :show-rating="false" :increment="0.5" :rating="course.rating_average"></star-rating>
											</span>
											<span class="rating-review-numbers">
												<span class="rating-review-stats">{{ courseAverage(course) }}</span>
												<span class="text-muted ml-1">({{ course.ratings_count }})</span>
											</span>
										</div>
										<div class="price float-right">
											<template v-if="course.free_course != 1">
												<h6 class="mt-3" v-if="course.has_discount == 1"><small class="text-muted"><strike>₱{{course.price}}</strike> </small>&nbsp; <b>₱{{course.discount}}</b> </h6>
												<h6 class="mt-3" v-else>
													<client-only>
														₱<b>{{course.price | numeral('0,0')}}</b>
													</client-only>
												</h6>
											</template>
											<template v-else>
												<h6 class="mt-3">Free Course</h6>
											</template>
										</div>
									</div>
								</div>
							</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import { mapGetters } from 'vuex'

	import StarRating from 'vue-star-rating'

	export default {

		components: {
			StarRating
		},

		middleware: 'auth',

		head() {
			return { title: 'Online Courses - Anytime, Anywhere' }
		},

		computed: mapGetters({
			user: 'auth/user'
		}),

		async asyncData({ error }) {
			try {
				let { data } = await axios.get('/welcome')
				return {
					enrolled_courses: data.enrolled_courses,
					courses: data.courses
				}
			} catch (e) {
				error({ statusCode: 500, message: 'Something went wrong' })
			}
		},

		methods: {
			totalPercentage: function (encourse) {
				return parseInt((encourse.progress_count / encourse.lessons_count) * 100)
			},
			courseAverage: function (course) {
				return parseFloat(course.rating_average).toFixed(1)
			}
		}
	}
</script>

<style scoped>
	.bg-image {
		background-image: url('https://res.cloudinary.com/dl9phqhv0/image/upload/v1578039329/HQ%20Images/eb91edb8-3561-4cf3-843a-a56790395ab1_itmr9l.jpg');
		-webkit-background-size: cover;
		-moz-background-size: cover;
		-o-background-size: cover;
		background-size: cover;
		background-repeat: no-repeat;
	}
	.home-fact-area {
		color: #fff;
		padding: 15px 0;
	}
	.home-fact-box .text-box {
		padding: 10px 0 10px 63px;
	}
	.home-fact-box svg {
		font-size: 47px;
		margin-top: 8px;
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
	.encourse-title {
		font-size: 15px;
	    line-height: 1.287;
	    max-height: 38px;
	    max-width: 280px;
	}
	.tiny-course {
		margin-top: 63px;
    	margin-bottom: 8px;
    	color: #000;
	}
	.VueCarousel-slide {
		padding-left: 0px !important;
		padding-right: 5px !important;
	}
</style>
