let initialSkill = 'Fight[S]';
let skillsOptions = getSkillsOptions();
let initialSkillBonus = skillsOptions?.find(s => s.name == initialSkill).value;

function getSkillsOptions() {
  if (actor === undefined) {
    return null;
  }
  return actor.data.items
    .filter(item => item.type === 'skill' && item.name != '[ATTRIBUTES]' && item.name != '[SKILLS]' && item.name != '[RESOURCES]')
    .map(function (element) {
      return { name: element.name, value: element.data.rank }
    })
    .sort((a, b) => (a.name > b.name) ? 1 : -1);
}

function roll() {
  var skill = document.getElementById("skillDropDown");
  var aspectBonus = document.getElementById("aspectBonus").value;
  var otherAdjustments = document.getElementById("otherAdjustments").value;
  let roll = new Roll(`4df+${skill.value ? skill.value : 0}+${aspectBonus ? aspectBonus : 0}+${otherAdjustments ? otherAdjustments : 0}`).roll();
  roll.toMessage({ flavor: `4df ${skill.options[skill.selectedIndex].text} Skill Roll - click to see the dice` });
}

let dialogContent = `
  <script>
    function SkillChanged(selectedSkill) {
      document.getElementById("skillBonus").innerHTML = (selectedSkill.value >= 0? '+': '') + selectedSkill.value
    }
  </script>

  <p>Enter the numbers for your skill, attribute and bonuses</p>
  <table style="width:100%">
    <tr>
      <th style="width:33%">
        <label>Skill</label>
      </th>
      <td style="width:33%">
        <select id="skillDropDown" onchange=SkillChanged(this)>
          ${skillsOptions.map(e => `<option value="${e.value}" ${e.name == initialSkill ? ' selected' : ''}>${e.name}</option>`).join(``)}
        </select>
      </td>
      <td style="width:33%;border 1px solid black;padding:5px" id="skillBonus">${(initialSkillBonus >= 0 ? '+' : '') + initialSkillBonus}</td>
    </tr>
    <tr>
      <th style="width:33%">
        <label>Aspect Bonusus</label>
      </th> 
      <td style="width:33%">
      <input type = "text" id="aspectBonus" \>
      </td>
    </tr>
    <tr>
      <th style="width:33%">
        <label>Other Adjustments</label>
      </th> 
      <td style="width:33%">
        <input type = "text" id="otherAdjustments" \>
      </td>
    </tr>
  </table>
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