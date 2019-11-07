import injector from 'vue-inject';
import Vue from 'vue';

//usage   
/*

EventBus.$emit('i-got-clicked', this.clickCount);


EventBus.$on('i-got-clicked', clickCount => {
  console.log(`Oh, that's nice. It's gotten ${clickCount} clicks! :)`)
});
*/
function EventBus() {
  return {
    _eventBus: null,
    attachEvent(event, fn){
      this.getBus().$off(event);
      this.getBus().$on(event, fn);
    },
    emit(event, args){
      this.getBus().$emit(event, args);
    },
    getBus(){
      if(this._eventBus == null){
        this._eventBus = new Vue();
      }
      return this._eventBus;
    }
  }
}
injector.service('EventBus', EventBus);