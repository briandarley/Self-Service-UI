<template>
  <div class="container">
    <div class="step-navigation">
      <ul>
        <li :class="{'selected': isSelected('BASIC_INFORMATION')}" >
          <a href="#" @click.prevent="goto('BASIC_INFORMATION')">Basic Information</a>
        </li>
        <i class="fa fa-arrow-right"></i>
        <li :class="{'not-selectable': notSelectable('AUDIENCE_CRITERIA'), 'selected': isSelected('AUDIENCE_CRITERIA')}" >
          <a href="#" @click.prevent="goto('AUDIENCE_CRITERIA')">Audience Criteria</a>
        </li>
        <i class="fa fa-arrow-right"></i>
        <li :class="{'not-selectable': notSelectable('MESSAGE_CONTENTS'),'selected': isSelected('MESSAGE_CONTENTS')}"  >
          <a href="#" @click.prevent="goto('MESSAGE_CONTENTS')">Message Contents</a>
        </li>
        <i class="fa fa-arrow-right"></i>
        <li :class="{'not-selectable': notSelectable('MESSAGE_SUMMARY'),'selected': isSelected('MESSAGE_SUMMARY')}"   >
          <a href="#" @click.prevent="goto('MESSAGE_SUMMARY')">Message Summary</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script src="./step-navigation.js"></script>
<style lang="scss" src="./step-navigation.scss" scoped></style>
