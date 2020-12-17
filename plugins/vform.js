import Vue from 'vue'
import { HasError, AlertError, AlertSuccess } from 'vform'

Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)
Vue.component(AlertSuccess.name, AlertSuccess)

import Form from 'vform'

Form.prototype.fill = function (data) {
	Object.keys(data).forEach(key => {
		this[key] = data[key]
	})
}