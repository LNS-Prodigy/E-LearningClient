<template>
	<div>
					
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
				hideSidebar: false
			}
		},

		async asyncData({ params, error }) {
			try {
				let { data } = await axios.get(`/student/account/my-courses/learning/${params.slug}/show/lesson/${params.id}`)
				return {
					course: data.showCourse,
					sections: data.sections,
					lessons: data.lessons,
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

			getClass(property) {
				return {
					'col-lg-9': this.hideSidebar == false,
					'col-lg-12': this.hideSidebar == true
				}
			}
		}
	}
</script>


<style lang="scss" scoped>

</style>