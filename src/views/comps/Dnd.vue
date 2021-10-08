<template>
  <div class="dnd">
    <div class="droppable">
      <div class="draggable" draggable="true"></div>
    </div>
    <div class="droppable"></div>
    <div class="droppable"></div>
    <div class="droppable"></div>
  </div>
</template>
<script>
export default {
  name: 'dnd',
  data() {
    return {}
  },
  methods: {},
  mounted() {
    this.$nextTick(() => {
      const draggable = document.querySelector('.draggable');
      const droppables = document.querySelectorAll('.droppable');
      draggable.addEventListener('dragstart', dragStart);

      function dragStart() {
        this.className += ' dragging';
        // setTimeout(() => {
        //   this.className = 'invisible'
        // }, 0)
      }

      for (const droppable of droppables) {
        droppable.addEventListener('dragover', dragOver);
        droppable.addEventListener('dragleave', dragleave)
        droppable.addEventListener('dragenter', dragEnter)
        droppable.addEventListener('drop', dragDrop)
      }

      function dragOver(e) {
        e.preventDefault()
      }

      function dragleave() {
        this.className = 'droppable'
      }

      function dragEnter(e) {
        e.preventDefault();
        this.className += ' drag-over'
      }

      function dragDrop() {
        this.className = 'droppable';
        this.append(draggable)
      }
    })
  }
}
</script>

<style scoped lang="scss">
.draggable {
  background-color: orange;
  position: relative;
  height: 150px;
  width: 150px;
  top: 5px;
  left: 5px;
  cursor: pointer;
}

.droppable {
  display: inline-block;
  height: 160px;
  width: 160px;
  margin: 10px;
  border: 3px salmon solid;
  background-color: white;
}

.dragging {
  border: 4px yellow solid;
}

.drag-over {
  background-color: #f4f4f4;
  border-style: dashed;
}

.invisible {
  display: none;
}
</style>