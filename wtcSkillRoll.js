/** Simple dialog to roll Fudge dice with 3 categories of bonuses for Wearing the Cape
  * Adapted from the Animated Objects attack/damage macro by HoneyBadger
*/

let initialSkill = 'Four[A]';
let skillsOptions = getSkillsOptions();
let initialSkillBonus = skillsOptions?.find(s => s.name == initialSkill).value;

function getSkillsOptions() {
  if (actor === undefined) {
    return null;
  }
  return [
    {name: "One[A]", value: "1"},
    {name: "Two[S]", value: "2"},
    {name: "Three[R]", value: "3"},
    {name: "Four[A]", value: "4"},
    {name: "Five[S]", value: "5"},
    {name: "Six[R]", value: "6"},
  ]
}

function roll() {
  var skill = document.getElementById("skillDropDown");
  var attributeBonus = document.getElementById("attributeBonus").value;
  var aspectBonus = document.getElementById("aspectBonus").value;
  var circumstanceModifier = document.getElementById("circumstanceModifier").value;
  console.log(`4df + skill:${skill.value ? skill.value : 0} + attributeBonus:${attributeBonus ? attributeBonus : 0} + aspectBonus:${aspectBonus ? aspectBonus : 0} + circumstanceModifier:${circumstanceModifier ? circumstanceModifier : 0}`);
}

let dialogContent = `
  <script>
    function SkillChanged(selectedSkill) {
      document.getElementById("skillBonus").innerHTML = (selectedSkill.value >= 0? '+': '') + selectedSkill.value;
      ShowHideAttributeBonus();
    }
    function ShowHideAttributeBonus() {
      var skill = document.getElementById("skillDropDown");
      var skillName = skill.options[skill.selectedIndex].text
      console.log("skill:" + skillName);
      if (skillName.includes('[A]'))
      {
        document.getElementById("attributeBonusRow").style.display = 'none';
        document.getElementById("buffer").style.display = '';
      }
      else
      {
        document.getElementById("attributeBonusRow").style.display = '';
        document.getElementById("buffer").style.display = 'none';
      }
    }
  </script>

  <p style="width:100%">Pick a Character Rating and add modifiers</p>
  <table style="width:100%">
    <tr>
      <th style="width:33%">
        <label>Character Rating</label>
      </th>
      <td style="width:33%">
        <select id="skillDropDown" onchange=SkillChanged(this)>
          ${skillsOptions.map(e => `<option value="${e.value}" ${e.name == initialSkill ? ' selected' : ''}>${e.name}</option>`).join(``)}
        </select>
      </td>
      <td style="width:33%;border 1px solid black;padding:5px" id="skillBonus">${(initialSkillBonus >= 0 ? '+' : '') + initialSkillBonus}</td>
    </tr>
    <tr id="attributeBonusRow" style=${initialSkill.includes(['A'])?"display:none": "display:''"}>
      <th style="width:33%">
        <label id="attributeBonusLabel">Attribute Bonus</label>
      </th> 
      <td style="width:33%">
      <input type = "text" id="attributeBonus" \>
      </td>
    </tr>
    <tr>
      <th style="width:33%">
        <label>Aspect Bonus</label>
      </th> 
      <td style="width:33%">
      <input type = "text" id="aspectBonus" \>
      </td>
    </tr>
    <tr>
      <th style="width:33%">
        <label>Circumstance Modifier</label>
      </th> 
      <td style="width:33%">
        <input type = "text" id="circumstanceModifier" \>
      </td>
    </tr>
  </table>
  <div id="buffer" style=${initialSkill.includes(['A'])?"height:50px;display:''": "display:none"}></div>
  `;

let d = new Dialog({
  title: 'WtC Skill Roll',
  content: dialogContent,
  buttons: {
    roll: {
      icon: '<i class="fas fa-dice-d20"></i>',
      label: "Roll",
      callback: () => roll()
    }
  }
});
d.render(true);