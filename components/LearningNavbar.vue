<template>
	<nav class="navbar navbar-expand-lg navbar-light bg-gradient-default fixed-top" style="height: 60px;">
		<div class="container-fluid">
			<router-link :to="{ name: 'home' }" class="navbar-brand">
				<img src="https://res.cloudinary.com/dl9phqhv0/image/upload/c_scale,w_172/v1574062722/Logos/logo-light_gwp73l.png" alt="E-Learning" class="m-t-5 img-fluid" />
			</router-link>

			<button :aria-label="$t('toggle_navigation')" class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false">
				<fa icon="bars" fixed-width />
			</button>

			<div id="navbarToggler" class="collapse navbar-collapse">
				<ul class="navbar-nav navbar-nav-hover border-left pl-3">
					<li class="nav-item">
						<router-link :to="{ name: 'course.show', params: { slug: course.slug } }" class="text-white">
							{{ course.title }}
						</router-link>
					</li>
				</ul>

				<ul class="navbar-nav ml-auto">
					<li class="nav-item dropdown mr-4">
						<a href="#" class="text-white dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							<div class="d-inline-block p-2">
								<fa icon="trophy" />
							</div> Your Progress 
						</a>
						<div class="dropdown-menu dropdown-menu-right course_progress">
							<div class="p-2 px-4">
								<h6 class="text-dark font-weight-600">
									<small>{{progress}} of {{countLesson}} complete</small>
								</h6>
								<p class="mb-0 small">Finish course to get your certificate.</p>
							</div>
						</div>
					</li>
					<li class="nav-item">
						<a href="#" class="btn btn-outline-neutral btn-sm p-2 text-capitalize rounded nav-link text-white" @click="openShareButtonsModal">
							<fa icon="share-square" fixed-width /> &nbsp;Share &nbsp;
						</a>
					</li>
					<li class="nav-item dropdown mr-0">
						<a href="#" class="btn btn-outline-neutral btn-sm py-2 px-1 rounded text-white nav-link" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							<fa icon="ellipsis-v" fixed-width />
						</a>
						<div class="dropdown-menu dropdown-menu-right" style="z-index: 10000;">
							<router-link :to="{ name: 'student.courses' }" class="dropdown-item">
								My Courses
							</router-link>
							<a href="#" class="dropdown-item">
								Favorite this course
							</a>
						</div>
					</li>
				</ul>
			</div>
		</div>

		<transition name="fade" mode="out-in">
        	<share-buttons v-if="showShareButtons" @close="closeShareButtonsModal" :course="course"></share-buttons>
        </transition>

	</nav>
</template>

<script>
	let myBody = null

	import axios from 'axios'
	import ShareButtons from '~/components/courses/show/share'

	import RatingModal from '~/components/courses/enrolled/rating'

	export default {

		components: {
			RatingModal
		},

		props: ['course', 'countLesson', 'lessons', 'progress', 'currentLesson'],

		components: {
			ShareButtons, RatingModal
		},

		data: function () {
			return {
				appName: process.env.appName,
				showShareButtons: false,
				showRatingModal: false,
				rated: false
			}
		},

		methods: {
			// Open share buttons modal
            openShareButtonsModal: function() {
                this.showShareButtons = true

                // Add class to body
                myBody.classList.toggle('modal-open')
            },

            closeShareButtonsModal: function () {
                this.showShareButtons = false
                myBody.classList.remove('modal-open')
            },

            openRatingModal: function () {
            	this.showRatingModal = true

            	myBody.classList.toggle('modal-open')
            },

            closeRatingModal: function () {
            	this.showRatingModal = false
            	myBody.classList.remove('modal-open')
            },

            saveNewRating: function () {
            	this.rated = true
            }
		},

		mounted: function () {
            myBody = document.getElementsByTagName('body')[0]

            window.addEventListener('scroll', this.onScroll)
        },

	}
</script>

<style scoped>
	.dropdown-menu {
		z-index: 10000;
	}
	.progress--progress-circle--N7Wwx {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 35px;
		height: 35px;
	}
	.course_progress {
		width: 280px;
	}
</style>
