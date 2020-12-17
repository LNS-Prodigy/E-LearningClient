<template>
	<div>
		<!-- // Jumbotron What Category You Are In -->
		<div class="jumbotron bg-gradient-danger mb-0 rounded-0 p-0">
			<section class="py-4">
				<div class="container">
					<h2 class="text-white font-weight-300 mb-0 py-2">
						{{ category.name }} Courses
					</h2>
				</div>
			</section>
		</div>

		<section class="section-sm">
			<div class="container">
				<div>
					<h3 class="font-weight-600">Courses to get you started!</h3>

					<ul class="nav mt-4">
						<li class="nav-item">
							<h5>
								<a @click="showMostPopular" type="button" href="#most-popular" :class="{ 'router-link-active' : isMostPopular == true }" class="nav-link" aria-label="trending">
									Most Popular
								</a>
							</h5>
						</li>
						<!-- <li class="nav-item">
							<h5>
								<a @click="showTrending" type="button" href="#trending" :class="{ 'router-link-active' : isTrending == true }" class="nav-link" aria-label="trending">
									Trending
								</a>
							</h5>
						</li> -->
					</ul>

					<template v-if="isMostPopular == true">
						<most-popular :mostPopular="mostPopular"></most-popular>
					</template>

					<template v-else-if="isTrending == true">
						<trending></trending>
					</template>

				</div>
			</div>
		</section>

		<div class="jumbotron bg-image mb-0 rounded-0 p-4">
			<div class="container">
				<div class="row justify-content-between">
					<div class="col-lg-4" v-for="(item, key) in promotions" :key="key">
						<div class="card border h-100">
							<!---->
							<div class="card-body">
								<div class="d-flex px-3 pt-3">
									<div>
										<div class="icon icon-shape bg-gradient-default shadow rounded-circle text-white">
											<fa :icon="item.icon" fixed-width />
										</div>
									</div>
									<div class="pl-4 pr-2">
										<h5 class="title font-weight-600">{{item.title}}</h5>
										<p>{{item.text}}</p>
									</div>
								</div>
							</div>
							<!---->
							<!---->
						</div>
					</div>
				</div>
			</div>
		</div>

		<section class="section-sm">
			<div class="container">
				<div class="mt-3">
					<h4 class="font-weight-300">
						Featured Course
					</h4>
					<client-only>
						<carousel :perPage="1" :loop="true" :paginationEnabled="false" :mouse-drag="false" :autoplay="true" easing="ease" :autoWidth="true" :autoHeight="true" :center="true" :navigationEnabled="true" navigationNextLabel="&rsaquo;" navigationPrevLabel="&lsaquo;">
							<slide v-for="(course, key) in featuredCourse" :key="key" class="py-4">
								<div>
									<div class="card border shadow-sm--hover rounded">
										<div class="card-body pt-3 pb-2">
											<div class="row">
												<!-- // Image -->
												<div class="col-lg-5">
													<client-only>
														<cld-image :publicId="`${course.image_public_id}.png`" responsive="width" alt="">
															<cld-transformation height="236" width="420" crop="fill" radius="2" />
														</cld-image>
													</client-only>
												</div>
												<!-- // Course Details -->
												<div class="col-lg-7">
													<div>
														<h5 class="font-weight-600 mb-0">{{ course.title }}</h5>
														<p class="published-time">Last Updated {{ course.updated_at | moment("from", "now") }}</p>
														<div class="rating-row d-inline-block">
															<div>
																<span class="course-badge best-seller mr-2">{{course.level}}</span>
																<small class="mr-2">
																	<span class="text-other"> {{course.lessons_count}} Lectures &#9679;</span>
																	<span class="enrolled-num text-other">{{ course.students_count }} Students enrolled</span>
																</small>
															</div>
															<div>
																<div class="rating-stars mt-2">
																	<span class="rating-star-container">
																		<star-rating :star-size="15" :inline="true" :read-only="true" :show-rating="false" :increment="0.5" :rating="course.rating_average"></star-rating>
																	</span>
																	<span class="rating-review-numbers">
																		<span class="rating-review-stats">{{ courseAverage(course) }}</span>
																		<span class="text-muted ml-1">({{ course.ratings_count }})</span>
																	</span>
																</div>
															</div>
														</div>
														<div class="excerpt text-dark">
															{{ course.excerpt }} | By: {{ course.user.name }}
															<div class="mt-3">
																<router-link :to="{ name: 'course.show', params: { slug: course.slug } }" class="btn btn-default rounded text-capitalize">
																	Explore Course
																</router-link>
															</div>
														</div>
														<div class="float-right">
															<p v-if="course.free_course == 1" class="mb-0 text-dark">
																Free Course
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</slide>
						</carousel>
					</client-only>
				</div>
				<div class="mt-3">
					<h4 class="font-weight-300">
						All {{ category.name }} Courses
					</h4>
					<div>
						<div class="d-block">
							<p class="mb-0">{{countCourses}} courses</p>
						</div>

						<!-- // Course Lists -->
						<hr class="mb-0 mt-4">

						<div class="row">
							<!-- // Main Category Courses -->
							<div class="col-lg-12">
								<category-courses :courses="courses"></category-courses>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>


	</div>
</template>

<script>
	import axios from 'axios'
	import MostPopular from '../../../components/courses/category/popular.vue'
	import Trending from '../../../components/courses/category/trending.vue'
	import CategoryCourses from '../../../components/courses/category/all_courses.vue'
	import StarRating from 'vue-star-rating'

	export default {

		components: {
			MostPopular, Trending, CategoryCourses, StarRating
		},

		head() {
			return { title: this.category.name }
		},

		data: () => ({
			isMostPopular: true,
			isTrending: false,
		}),

		async asyncData({ params, error }) {
			try {
				let { data } = await axios.get(`/course/category/${params.slug}`)
				return {
					category: data.category,
					featuredCourse: data.featuredCourse,
					countCourses: data.countCourses,
					mostPopular: data.mostPopular,
					courses: data.courses
				}
			} catch (e) {
				error({ statusCode: 404, message: 'Page not found' })
			}
		},

		methods: {
			showMostPopular() {
				this.isMostPopular = true
				this.isTrending = false
			},

			showTrending() {
				this.isTrending = true
				this.isMostPopular = false
			},

			courseAverage: function (course) {
				return parseFloat(course.rating_average).toFixed(1)
			}
		},

		computed: {
			promotions() {
				return [
					{
						icon: 'history',
						title: 'Go at your own pace',
						text: "Enjoy lifetime access to courses on Academy's website"
					},
					{
						icon: 'check',
						title: 'Learn from industry experts',
						text: 'Select from top instructors around the world'
					},
					{
						icon: 'play',
						title: 'Find video courses on almost any topic',
						text: 'Build your library for your career and personal growth'
					}
				]
			}
		}

	}

</script>

<style lang="scss" scoped>

	.published-time {
		color: #686f7a;
	    font-size: 13px !important;
	    line-height: 20px;
	    margin-bottom: 12px;
	}

	.search {
        &_image {
            width: 210px;
            height: 118px;
            object-fit: cover;
        }
        &_body {
            cursor: pointer;
        }
        &_body:hover {
            background: whitesmoke;
        }
    }

	.nav-link {
		font-size: 14px !important;
		padding: 0.70rem 10px !important;
		margin-right: 2rem;
		color: #000;
	}

	.router-link-active {
		border-bottom: 5px solid red;
		cursor: text;
	}

	.nav-link:hover {
		color: red;
		border-bottom: 5px solid red;
	}
	 .course-header-wrap .course-badge {
        font-size: 9px !important;
    }
    .course-badge.best-seller {
        background: #f4c150;
    }
    .course-header-wrap > div > span {
        margin-right: 12px;
        margin-bottom: 7px;
        font-size: 15px;
    }
    .course-badge {
        color: #29303b;
        box-shadow: 0 0 1px 1px rgba(20,23,28,.1), 0 3px 1px 0 rgba(20,23,28,.1);
        pointer-events: none;
        border-radius: 3px;
        font-size: 9px;
        padding: 1px 8px;
        font-weight: 700;
        position: relative;
        line-height: 1.5;
        text-align: center;
        text-transform: uppercase;
        display: inline-block;
    }
    .course-badge:after {
        border-radius: 3px;
        right: -4px;
        background: inherit;
        content: "";
        height: 11px;
        position: absolute;
        top: 2px;
        transform: rotate(45deg);
        width: 11px;
        z-index: 0;
        display: block;
    }
    .course-header-wrap > div > span {
        margin-right: 12px;
        margin-bottom: 7px;
        font-size: 15px;
    }
    .course-sidebar {
        background-color: #fff;
        box-shadow: 0 0 1px 1px rgba(20,23,28,.1), 0 3px 1px 0 rgba(20,23,28,.1);
        border-radius: 4px;
        color: #505763;
        padding: 3px;
        position: relative;
        margin-top: -250px;
        z-index: 10;
	}
	hr {
        border-top: 0.25rem solid rgba(0, 0, 0, 0.1);
	}
</style>
