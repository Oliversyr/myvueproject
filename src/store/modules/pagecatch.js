/**
 * Created by Administrator on 2017-10-17.
 */
const pagecatch = {
    state: {

    },
    mutations: {
        UpdateData(state, obj) {
            console.log("updateStateData1==", obj);
            state[obj.name] = {
                noRefresh: false,
                catchData: {}
            }

            state[obj.name].catchData = obj.obj;
        },
        UpdateParam(state, name) {
            // alert(name);
            state[name].noRefresh = true;
        }
    },
    actions: {
        updateStateData({commit}, obj) {
            // console.log("updateStateData==", obj );
            commit('UpdateData', obj);
        },

        updateStateParam({commit}, name) {
            console.log("updateStateData==", name );
            commit('UpdateParam', name);
        }
    }

}

export default pagecatch;