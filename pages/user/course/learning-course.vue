<template>
	<div>
		<navbar :course="course" :countLesson="lessons.length" :lessons="lessons" :progress="progress" :currentLesson="lesson.title"></navbar>

		<section class="m-t-60">
			<div class="container-fluid">
				<div class="row" :class="getCenter()">
					<div class="px-0 col-lg-9">
						<div :class="{ 'cinematic-view' : lesson.lesson_type == 'VIDEO' }">
							<!-- // Course Overview/Preview -->
							<div class="position-absolute" style="top: 80px; right: 0px; z-index: 10;" v-if="hideSidebar">
								<a href="#" class="p-3 text-white" @click.prevent="toggleSidebar">
									<fa icon="arrow-left" fixed-width /> Show sidebar
								</a>
							</div>

							<template v-if="lesson.lesson_type === 'TFILE'">
								<div class="section">
									<div class="row justify-content-center">
										<div class="col-lg-7">
											<h3 class="display-4">{{lesson.title}}</h3>
											<div class="mt-4" v-html="lesson.text_file">
												{{ lesson.text_file }}
											</div>
											<div v-if="lesson.lesson_attachment != null" class="file mt-4">
												<a href="#" @click.prevent="download">
													<div class="border rounded p-3 w-50">
														<p class="mb-0"><fa :icon="['far', 'file-archive']" fixed-width /> &nbsp; Download Attachment</p>
													</div>
												</a>
											</div>
										</div>
									</div>
								</div>
							</template>
							<template v-if="lesson.lesson_type === 'PDF'">
								<section class="section">
									<div class="px-5">
										<h3 class="display-4">{{lesson.title}}</h3>
										<div>

										</div>
									</div>
								</section>
							</template>
							<template v-else-if="lesson.lesson_type === 'VIDEO'">
								<div>
									<client-only>
										<!-- // Youtube -->
										<vue-plyr v-if="lesson.lesson_provider === 'Youtube'" :options="options" :crossorigin="true">
											  <div data-plyr-provider="youtube" :data-plyr-embed-id="lesson.video_url"></div>
										</vue-plyr>

										<vue-plyr v-else-if="lesson.lesson_provider === 'Vimeo'">
											<div class="plyr__video-embed">
												<iframe
													:src="`https://player.vimeo.com/video/${lesson.video_url}?loop=false&byline=false&portrait=false&title=false&speed=true&transparent=0&gesture=media`"
													allowfullscreen allowtransparency allow="autoplay">
												</iframe>
											</div>
										</vue-plyr>

										<!-- https://www.w3schools.com/html/mov_bbb.mp4 -->
										<!-- video element -->
										<vue-plyr v-else-if="lesson.lesson_provider === 'HTML5'">
											<video :poster="lesson.thumbnail" src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer.mp4">
												<source src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4" type="video/mp4" size="576">
												<source src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4" type="video/mp4" size="720">
												<source src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4" type="video/mp4" size="1080">
												<track kind="captions" label="English" srclang="en" src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer.vtt" default>
											</video>
										</vue-plyr>
									</client-only>
								</div>
							</template>
						</div>

                        <div>
                        	<ul class="list-unstyled pt-3 border-bottom border-top px-5">
	                        	<!-- // Overview -->
								<li class="d-inline-block mr-5" v-for="(link, key) in links" :key="key">
									<router-link :to="{ name: link.route }" class="page-header text-dark" >
										{{ link.name }}
									</router-link>
								</li>
							</ul>

							<div class="mt-5">
								<div class="row justify-content-center">
									<div class="col-lg-8 mb-5">
										<router-view />
									</div>
								</div>
							</div>
                        </div>

						<div>
							<footer class="bg-white border-top" style="border-bottom: solid 5px #bc4e9c">
								<section class="section-sm">
									<div class="container">
										<div class="row">
											<div class="col-lg-6">
												<img src="https://res.cloudinary.com/dl9phqhv0/image/upload/c_scale,w_150/v1573175311/Logos/logo-dark_uaqwbf.png" alt="E-Learning" class="img-fluid" />
											</div>
											<div class="col-lg-6">
												<ul class="nav justify-content-md-end footer-menu">
													<li class="nav-item">
														<a class="nav-link" href="http://demo.academy-lms.com/default/home/about_us">About</a>
													</li>
													<li class="nav-item">
														<a class="nav-link" href="http://demo.academy-lms.com/default/home/privacy_policy">Privacy policy</a>
													</li>
													<li class="nav-item">
														<a class="nav-link" href="http://demo.academy-lms.com/default/home/terms_and_condition">Terms &amp; condition</a>
													</li>
													<li class="nav-item">
														<router-link :to="{ name: 'help-center.student' }" class="nav-link">
															Help Center
														</router-link>
													</li>
												</ul>
											</div>
										</div>
									</div>
								</section>
							</footer>
						</div>

					</div>

					<div class="col-lg-3 px-0" :class="{ 'd-none' : hideSidebar }">
						<!-- // Course Section and Lessons -->
                    	<right-sidebar :courseSlug="course.slug" :sections="sections" @close="toggleSidebar" :lessons="lessons" @clicked="updateLesson"></right-sidebar>
					</div>
				</div>

			</div>
		</section>

	</div>
</template>

<script>
	import axios from 'axios'

	import Navbar from '~/components/LearningNavbar'

	if (process.client) {
        let Youtube = document.createElement('script')
        Youtube.setAttribute('src', "https://www.youtube.com/iframe_api")
    }

    // Components
    import RightSidebar from '~/components/courses/enrolled/right_sidebar'

	export default {

		layout: 'learning',

		components: {
			RightSidebar, Navbar
		},

		middleware: 'auth',

		head() {
			return { title: this.course.title }
		},

		data: function () {
			return {
				showShareButtons: false,
				hideSidebar: false,

				options: {
					settings: { captions: true }
				}
			}
		},

		async asyncData({ params, error }) {
			try {
				let { data } = await axios.get(`/student/account/my-courses/learning/${params.lesson_id}/lesson/${params.slug}/show`)
				return {
					course: data.showCourse,
					sections: data.sections,
					lessons: data.lessons,
					progress: data.progress,
					lesson: data.lesson,
				}
			} catch (e) {
				error({ statusCode: 404, message: "Woops, something is wrong!"})
			}
		},

		computed: {
			tabs: function () {
				return [
					{
						name: 'My Courses',
						route: 'student.courses'
					}
				]
			},

			links: function () {
				return [
					{
						name: 'Overview',
						route: 'student.courses.learn'
					},
					{
						name: 'Q & A',
						route: 'student.courses.learn.qanda'
					},
					{
						name: 'Announcements',
						route: 'student.courses.learn.announcements'
					}
				]
			}
		},

		methods: {
			toggleSidebar: function () {
				this.hideSidebar = !this.hideSidebar
			},

			// getClass(property) {
			// 	return {
			// 		'col-lg-9': this.hideSidebar == false,
			// 		'col-lg-9': this.hideSidebar == true
			// 	}
			// },

			getCenter(property) {
				return {
					'' : this.hideSidebar == false,
					'justify-content-center' : this.hideSidebar == true
				}
			},

			updateLesson: function (value) {
				this.$set(this.lessons[value.index].get_progress, 'status', 1)
				this.progress++
				console.log(this.lessons[value.index].get_progress)
			},

			download: function (index) {
				axios({
					url: this.lesson.lesson_attachment,
					method: 'GET',
					responseType: ' blob'
				}).then((res) => {
					var fileURL = window.URL.createObjectURL(new Blob([res.data]));
                    var fileLink = document.createElement('a');

                    fileLink.href = fileURL;
                    fileLink.setAttribute('download', this.lesson.lesson_attachment);
                    document.body.appendChild(fileLink);

                    fileLink.click();
				})
			}
		}
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
	.footer-menu .nav-link {
        padding: 6px 0;
        font-size: 13px;
    }
    .footer-menu .nav-item:not(:last-child) {
        margin-right: 20px;
    }
	.cinematic-view {
		background: black;
		margin-left: -12.35vw;
		padding-left: 12.35vw;
		margin-right: -12.35vw;
		padding-right: 12.35vw;
		position: relative;
	}
</style>
