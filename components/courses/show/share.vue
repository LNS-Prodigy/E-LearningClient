<template>
    <transition name="fade" mode="out-in">
        <modal header="Share this course">
            <template slot="header">
                <h5 class="modal-title">Share this course</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="close" @click="$emit('close')">
                    <span aria-hidden="true">&times;</span>
                </button>
            </template>
            <template slot="form">
                <div class="modal-body">
                    
                    <!-- // Copy input -->
                    <div class="d-inline">
					    <div class="input-group">
						    <input aria-describedby="addon-right addon-left" type="text" name="search" v-model="url" placeholder="Search for courses" class="form-inline form-control rounded-left">
						    <div class="input-group-prepend">
							    <button type="button" v-clipboard:copy="url" v-clipboard:success="onCopy" v-clipboard:error="onError" class="input-group-text btn btn-outline-danger rounded-right text-capitalize" >
                                    <template v-if="!onSuccess">
                                        <fa :icon="['far', 'copy']" fixed-width /> &nbsp; Copy
                                    </template>
                                    <template v-else-if="onSuccess == true">
                                        <fa icon="check" fixed-width /> &nbsp; Copied!
                                    </template>
							    </button>
						    </div>
					    </div>
				    </div>

                    <div class="mt-3">
                        <h6 class="text-dark">Share on</h6>
                        <div class="d-flex mt-2">
                             <social-sharing :url="url"
                                    :title="course.title"
                                    :description="course.excerpt"
                                    inline-template>
                                <div>
                                    <network network="email">
                                        <span class="btn btn-outline-primary btn-sm">
                                            <fa :icon="['far', 'envelope']" fixed-width />
                                        </span>
                                    </network>
                                    <network network="facebook">
                                        <span class="btn btn-outline-primary btn-sm">
                                            <fa :icon="['fab', 'facebook-f']" fixed-width />
                                        </span>
                                    </network>
                                    <network network="linkedin">
                                        <span class="btn btn-outline-primary btn-sm">
                                            <fa :icon="['fab', 'linkedin-in']" fixed-width />
                                        </span>
                                    </network>
                                    <network network="twitter">
                                        <span class="btn btn-outline-primary btn-sm">
                                            <fa :icon="['fab', 'twitter']" fixed-width />
                                        </span>
                                    </network>
                                </div>
                            </social-sharing>
                        </div>
                    </div>   
                    

                </div>
            </template>
        </modal>
    </transition>
</template>

<script>

    export default {

        name: 'ShareButtons',

        props: ['course'],

        data: function () {
            return {
                url: '',
                message: '',

                onSuccess: false,
                onErrorCopy: false
            }
        },

        created: function () {
            var currentUrl = window.location.pathname
            this.url = 'http://heroacademy.online/course/' + this.course.slug 
        },

        methods: {
            onCopy: function (e) {
                this.onSuccess = true
                this.message = 'Copied!'
            },

            onError: function (e) {
                this.onErrorCopy = true
                this.message = 'Copy failed'
            }
        }

    }
</script>

<style>

</style>