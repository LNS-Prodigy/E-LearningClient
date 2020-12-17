<template>
    <div>
        <!-- // Search and Breadcrumbs  -->
        <div class="jumbotron pt-4 pb-4 mb-0 bg-gradient-danger border-bottom">
            <div class="container">
                <div class="row">
                    <div class="col-lg-6">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb bg-transparent small p-0">
                                <li class="breadcrumb-item" aria-current="page">
                                    <router-link :to="{ name: 'help-center.student' }" class="text-white">Home</router-link>
                                </li>
                                <li class="breadcrumb-item" aria-current="page">
                                    <router-link :to="{ name: 'help-center.student.category', params: { slug: category.slug } }" class="text-white">{{category.name}} - General</router-link>
                                </li>
                                <li class="breadcrumb-item active text-white" aria-current="page">{{post.title}}</li>
                            </ol>
                        </nav>
                        <div class="mt-5">
                            <h1 class="text-white font-weight-300">{{post.title}}</h1>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="align-content-lg-end">
                            <!-- // Search Form  -->
                            <form class="my-auto d-inline float-right" @submit.prevent="submit">
								<div class="input-group input-group-alternative">
									<input aria-describedby="addon-right addon-left" v-model="search" type="text" name="search" placeholder="Search for solutions" class="form-inline form-control">
									<div class="input-group-prepend">
										<span class="input-group-text rounded-right">
										    <fa icon="search" fixed-width class="text-danger" />
									    </span>
								    </div>
							    </div>
							</form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <section class="section-sm">
            <div class="container">

                <div class="row">
                    <transition name="fade" mode="out-in">
                        <div class="col-lg-8 mr-3">
                            <!-- // Post -->
                            <client-only>
                                <span v-html="post.body">{{post.body}}</span>
                            </client-only>
                        </div>
                    </transition>
                    <div class="col-lg-3 border-left">
                        <div class="ml-3">
                            <div class="mb-4">
                                <router-link :to="{ name: 'help-center.contact' }" class="btn btn-default rounded text-capitalize btn-block">
                                    Contact Us
                                </router-link>
                            </div>
                            <!-- // Related Posts -->
                            <h6><b>Related Articles</b></h6>
                            <div class="pt-3 pb-3">
                                <ul class="list-unstyled">
                                    <li class="mb-2" v-for="(item, key) in related" :key="key">
                                        <router-link :to="{ name: 'help-center.student.category.post', params: { categorySlug: post.category_id, postSlug: item.slug } }">
                                            {{item.title}}
                                        </router-link>
                                    </li>
                                </ul>
                            </div>
                            <!-- // Categories -->
                            <h6><b>Student Topics</b></h6>
                            <div class="pt-3">
                                <ul class="list-unstyled small">
                                    <li class="mb-2" v-for="cat in categories" :key="cat.id">
                                        <router-link :to="{ name: 'help-center.student.category', params: { slug: cat.slug } }" class="text-dark">
                                            <svg width="15" height="15"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <image :xlink:href="cat.icon" height="15" width="15"/>
                                            </svg>
                                            <span class="ml-2">{{cat.name}}</span>
                                        </router-link>
                                    </li>
                                </ul>
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

    export default {
        scrollToTop: true,

        head() {
            return { title: this.post.title }
        },

        data: () => ({
            search: '',
            category: [],
            categories: [],
            related: []
        }),

        async asyncData({ params }) {
            try {
                let { data } = await axios.get(`/help-center/category/post/${params.categorySlug}/${params.postSlug}`)
                return {
                    post: data.post,
                    category: data.category,
                    categories: data.categories,
                    related: data.related
                }
            } catch (e) {
                return
            }
        },

        methods: {
            submit: function() {
                this.$router.push('/help-center/student/search?q=' + this.search)
            }
        }
    }
</script>

<style lang="scss" scoped>
    @media (min-width: 1200px) { 
		.container {
			max-width: 1040px !important;
		}
	}
</style>