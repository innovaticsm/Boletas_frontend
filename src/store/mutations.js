// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
import state from './state'
import { defaultMutations } from 'vuex-easy-access'

export default {...defaultMutations(state),

}