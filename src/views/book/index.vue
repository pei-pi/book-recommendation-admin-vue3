<template>
  <div class="mb-5">
    <VaButton color="info" size="large" class="mr-3 w-20"> 新增 </VaButton>
    <VaButton color="danger" size="large" class="w-30"> 批量删除 </VaButton>
    <div class="float-right">
      <VaInput v-model="value" placeholder="Default" class="mr-2 h-10" />
      <VaButton icon="search" class="w-20 h-10"> </VaButton>
    </div>
  </div>
  <VaDataTable :items="displayedItems" :columns="columns">
    <template #cell(actions)="{ row, isExpanded }">
      <VaButton
       class="pt-2"
        preset="plain"
        icon="edit"
        @click="openModalToEditItemById(row)"
      />
      <VaButton
        preset="plain"
        icon="delete"
        class="ml-3 pt-2"
        @click="deleteItemById(row)"
      />
      <VaButton
        :icon="isExpanded ? 'va-arrow-up' : 'va-arrow-down'"
        preset="secondary"
        class="w-full"
        @click="row.toggleRowDetails()"
      >
        {{ isExpanded ? "Hide" : "More info" }}
      </VaButton>
    </template>

    <template #expandableRow="{ rowData }">
      <div class="gap-2" >
        <div class="pl-2">
          <div class="gap-1">
            <span>name：</span>
            <span>{{ rowData.name }}</span>
          </div>
          <div class="">
            <span>author：</span>
            <span>{{ rowData.author }}</span>
          </div>
          <div class="">
            <span>tags：</span>
            <span>{{ rowData.tags }}</span>
          </div>
          <div class="">
            <span>category：</span>
            <span>{{ rowData.category }}</span>
          </div>
          <div class="">
            <span>detailedCategory：</span>
            <span>{{ rowData.detailedCategory }}</span>
          </div>
          <div class="" style="white-space: normal;
  ">
            <span>content：</span>
            <span>{{ rowData.content }}</span>
          </div>
          <div class="">
            <span>store：</span>
            <span>{{ rowData.store }}</span>
          </div>
        </div>
      </div>
    </template>
  </VaDataTable>
  <VaPagination
    v-model="currentPage"
    class="mt-4 justify-center sm:justify-start"
    :pages="totalPages"
    input
    buttons-preset="default"
  />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    const items = [
      {
        id: 1,
        name: "狂人日记",
        author: "鲁迅",
        tags: "小说",
        category: "小说作品",
        detailedCategory: "乡土小说",
        content:
          "小说通过被迫害者“狂人”的形象以及“狂人”的自述式的描写，揭示了封建礼教的“吃人”本质，表现了作者对以封建礼教为主体内涵的中国封建文化的反抗；也表现了作者深刻的忏悔意识。作者以彻底的“革命民主主义”的立场对中国的文化进行了深刻的反思，同时对中国的甚至是人类的前途表达了深广的忧愤。",
        store: 5,
      },
      {
        id: 2,
        name: "绝叫",
        author: "【日】叶真中显,林佩瑾",
        tags: "悬疑推理",
        category: "小说作品",
        detailedCategory: "悬疑推理",
        content:
          "铃木阳子死了，死在独居的公寓里。正确说来，是铃木阳子几个月前死了。因为发现她时，遗体不但遭到屋内的十一只猫啃食殆尽，连猫也全数饿死了。铃木阳子显然是“孤独死”的最佳范例，但这名女子为何落到这步田地？她的亲人、朋友、同事在哪里？她的人生轨迹又是怎样的？本书以两起相对独立的死亡事件为线索，牵出了三起相互交织的案件，讲述了女主人公阳子在时代裹挟中的个人挣扎，从平庸一步步滑落到不可救药的深渊。故事发生在2014年的日本都市。本书分为三条线：第一条线是“中年女子孤独死”案，从发现女尸开始，叙述女警绫乃的调查过程，逐渐揭露女主人公阳子的人生。第二条线从“非营利组织头目死亡”案开始。看似无关的...",
        store: 5,
      },
      {
        id: 3,
        name: "奥兰多",
        author: "【英】弗吉尼亚·伍尔夫",
        tags: "英国小说",
        category: "小说作品",
        detailedCategory: "外国小说",
        content:
          "奥兰多的故事，始于十六世纪伊丽莎白时代，终于一九二八年伍尔夫搁笔的“现时”，历时四百年。奥兰多先是一位天真无邪的贵族少年，因深受伊丽莎白女王宠幸而入宫庭。詹姆斯王登基后，大霜冻降临，奥兰多偶遇一位俄罗斯公主，坠入情网，结果是失恋亦失宠，隐居乡间大宅。",
        store: 5,
      },
      {
        id: 4,
        name: "钝感力（典藏版）",
        author: "【日】渡边淳一,李迎跃",
        tags: "日本小说",
        category: "小说作品",
        detailedCategory: "外国小说",
        content:
          "《钝感力》是渡边淳一经典励志大作。所谓的“钝感力”，是一种大智若愚的人生态度和人生智慧。相对于激进、敏感、强硬等而言，拥有钝感的人更容易在竞争激烈的现代社会立足。文中，作者从健康、恋爱、婚姻、职场、人际关系等方面阐述了钝感力的合理性和重要性，可以说是对人生的一种独特的解读，对生活和事业有全新的指导和启示作用。",
        store: 5,
      },
      {
        id: 5,
        name: "远离尘嚣 Far from the madding crowd",
        author: "【英】托马斯·哈代",
        tags: "外国小说",
        category: "小说作品",
        detailedCategory: "外国小说",
        content:
          "故事发生在静谧的英国乡村的田野上、农场里。当时，人们收获靠手工，车靠马拉，他们的生活伴随着季节的变化而起伏。当然，那安静的乡村世界早已成为过去，但是，那支配着人们生活的激情却丝毫未变。春去秋来，循环往复，爱却一如既往，猛烈地、不可阻挡地燃烧着。美丽的芭丝谢芭·伊芙丁自己拥有农场，没有必要嫁人。但是，她无法永远阻挡爱情。那位牧人盖伯瑞尔·奥克，他对芭丝谢芭的爱沉默而又稳定持久；那位农场主伯德伍德，他人至中年，严肃庄重，从未尝过爱情滋味；那位托伊中士，他红色戎装，英俊年轻……芭丝谢芭虽然自信、独立，但是，爱的猛烈、爱的激情，她要学的东西还很多很多。",
        store: 5,
      },
      {
        id: 6,
        name: "自卑与超越",
        author: "【奥】阿尔弗雷德·阿德勒,王晋华",
        tags: "外国经典",
        category: "小说作品",
        detailedCategory: "外国小说",
        content:
          "与《乌合之众》齐名，个体心理学研究领域的奠基之作。《自卑与超越》是个体心理学创始人阿德勒经典代表作。本书以“自卑情结”为线索，论述了自卑感的形成、影响及转变，旨在帮助人们克服自卑感，超越自我，找到个人与世界和谐共处的有效途径。全书立足于个体心理学观点，从教育、家庭、婚姻、伦理、社交等多个领域，以大量的实例为论述基础，阐明了人生道路的方向和人生意义的真谛，帮助人们正确面对缺陷，正确对待职业，正确理解社会，理解生活，理解人性。具有极深的哲理性和巨大的学术价值。",
        store: 5,
      },
      {
        id: 7,
        name: "Animal Farm（动物庄园）",
        author: "【英】乔治·奥威尔",
        tags: "英文原版",
        category: "小说作品",
        detailedCategory: "外国小说",
        content:
          "这本书是一部政治寓言体小说，故事描述了一场“动物主义”革命的酝酿、兴起和最终蜕变；一个农庄的动物不堪人类主人的压迫，在猪的带领下起来反抗，赶走了农庄主，牲畜们实现了“当家作主”的愿望，农场更名为“动物庄园”，奉行“所有动物一律平等”；之后，两只处于领导地位的猪为了权力而互相倾轧，胜利者一方宣布另一方是叛徒、内奸。此后，获取了领导权的猪拥有了越来越大的权力，成为新的特权阶级；动物们稍有不满，便会招致血腥的清洗：农庄的理想被修正为“有的动物较之其他动物更为平等”，动物们又回复到从前的悲惨状况。通过本书我们可以了解到那个时代的政治特点。本书语言幽默风趣、精练睿智，从中能体会到作者追求平等，追求自由的...",
        store: 5,
      },
    ];

    const columns = [
      { key: "name" },
      { key: "author" },
      { key: "tags" },
      { key: "category"},
      { key: "actions"},
    ];

    return {
      items,
      columns,
      searchValue:"",
      currentPage:1,
      itemsPerPage:6
    };
  },
  computed: {
    displayedItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredItems.slice(startIndex, endIndex);
    },
    filteredItems() {
      if (!this.searchValue) return this.items;
      return this.items.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(this.searchValue.toLowerCase())
        )
      );
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage);
    }
  }
});
</script>

<style>
.va-data-table__table-tr--expanded td {
  background: var(--va-background-border);
}

.va-data-table__table-expanded-content td {
  background-color: var(--va-background-element);
}
.va-data-table:not(.va-data-table--virtual-scroller){
  overflow-x: hidden ;
  overflow-y: auto ;
}
</style>
