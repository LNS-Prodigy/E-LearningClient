<template>
    <transition name="fade" mode="out-in">
        <modal :form_action="login" @keydown="form.onKeydown($event)" header="Login" :modalSm="true">
            <template slot="header">
                <h6 class="modal-title"><b>Login to your E-Learning Account</b></h6>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="$emit('close')">
                    <span aria-hidden="true">&times;</span>
                </button>
            </template>
            <template slot="form">
                <div class="modal-body">
                    
                    <div class="form-group mb-3">
                        <input type="email" name="email" v-model="form.email" :class="{ 'is-invalid' : form.errors.has('email') }" class="form-control rounded">
                        <has-error :form="form" field="email"></has-error>
                    </div>

                    <div class="form-group mb-3">
                        <input type="password" name="password" v-model="form.password" :class="{ 'is-invalid' : form.errors.has('password') }" class="form-control rounded">
                        <has-error :form="form" field="password"></has-error>
                    </div>

                    <div class="form-group row">
                        <div class="col-lg-6">
                            <checkbox v-model="remember" name="remember">
                                {{ $t('remember_me') }}
                            </checkbox>
                        </div>
                        <div class="col-lg-6">
                            <h6 class="float-right">
                                <a href="/password/reset" class="ml-auto my-auto text-default" @click.prevent="goToForgotPassword">
                                    {{ $t('forgot_password') }}
                                </a>
                            </h6>
                        </div>
                    </div>

                    <div class="text-center">
						<v-button :loading="form.busy" class="btn-block btn-lg">
						    {{ $t('login') }}
					    </v-button>
					</div>

                    <div class="text-center mt-4">
						<h6>Login With</h6>
						<div class="row mt-4">
							<div class="col-lg">
								<login-with-facebook class="btn-block"></login-with-facebook>
							</div>
							<div class="col-lg">
							    <login-with-google class="btn-block"></login-with-google>
						    </div>
						</div>
					</div>
                    
                </div>
            </template>
        </modal>
    </transition>
</template>

<script>
    import Form from 'vform'
    
    export default {
        middleware: 'guest',

        data: () => ({
            form: new Form({
                email: '',
                password: ''
            }),
            remember: false
        }),

        methods: {
            async login () {
                let data

                try {
                    const response = await this.form.post('/login')
                    data = response.data
                    this.$swal({
                        type: 'success',
                        text: 'Welcome to E-Learning!'
                    })
                } catch (e) {
                    return
                }

                // Save the token
                this.$store.dispatch('auth/saveToken', {
                    token: data.token,
                    remember: this.remember
                })

                // Fetch the user
                await this.$store.dispatch('auth/fetchUser')

                this.$emit('close')

                this.$router.go()

            },

            goToForgotPassword: function () {
                this.$router.push({ name: 'password.request' })
                this.$emit('close')
            }
        }
    }
</script>

<style>

</style>