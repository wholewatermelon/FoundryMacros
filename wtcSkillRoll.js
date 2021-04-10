/** Simple dialog to roll Fudge dice with 3 categories of bonuses for Wearing the Cape
  * Adapted from the Animated Objects attack/damage macro by HoneyBadger
*/

let initialSkill = 'Fight[S]';
let skillsOptions = getSkillsOptions();
let initialSkillBonus = skillsOptions?.find(s => s.name == initialSkill)?.value;

let attributes = skillsOptions?.filter(item => item.name.includes('[A]')).sort((a, b) => (a.name > b.name) ? 1 : -1); 
let skills = skillsOptions?.filter(item => item.name.includes('[S]')).sort((a, b) => (a.name > b.name) ? 1 : -1);
let resources = skillsOptions?.filter(item => item.name.includes('[R]')).sort((a, b) => (a.name > b.name) ? 1 : -1);

function getSkillsOptions() {
  if (!actor?.data?.items) {
    return null;
  }
  return actor.data.items
    .filter(item => item.type === 'skill' && item.name != '[ATTRIBUTES]' && item.name != '[SKILLS]' && item.name != '[RESOURCES]')
    .map(function (element) {
      return { name: element.name, value: element.data.rank }
    });
}

function roll() {
  var skill = document.getElementById("skillDropDown");
  var attributeBonus = document.getElementById("attributeDropDown")
  var aspectBonus = document.getElementById("aspectBonus").value;
  var circumstanceModifier = document.getElementById("circumstanceModifier").value;
  console.log(`4df + ${skill.options[skill.selectedIndex].text}(${skill.value ? skill.value : 0}) + ${attributeBonus.value ? (attributeBonus.options[attributeBonus.selectedIndex].text + '(' + attributeBonus.value + ')') : ''} + aspectBonus(${aspectBonus ? aspectBonus : 0}) + circumstanceModifier(${circumstanceModifier ? circumstanceModifier : 0})`);
}

function close() { }

function GetAttributeBonus(attributeValue) {
  if (attributeValue < 3) {
    return 0
  };
  if (attributeValue < 5) {
    return 1;
  }
  if (attributeValue < 7) {
    return 2;
  }
  if (attributeValue < 9) {
    return 3;
  }
  return 4;
}

let errorContent = 'Please select an Actor token and run the macro again';
let dialogContent = skillsOptions ? `
  <script>
    function SkillChanged(selectedSkill) {
      document.getElementById("skillBonus").innerHTML = (selectedSkill.value >= 0? '+': '') + selectedSkill.value;
      ShowHideAttributeBonus();
    }
    function AttributeBonusChanged(attributeBonus) {
      document.getElementById("attributeBonus").innerHTML = (attributeBonus.value && attributeBonus.value >= 0? '+': '') + attributeBonus.value;
    }
    function ShowHideAttributeBonus() {
      var skill = document.getElementById("skillDropDown");
      var skillName = skill.options[skill.selectedIndex].text
      
      if (skillName.includes('[A]'))
      {
        document.getElementById("attributeBonusRow").style.display = 'none';
        var attributeBonus = document.getElementById("attributeDropDown").value = '';
        document.getElementById("buffer").style.display = '';
      }
      else
      {
        document.getElementById("attributeBonusRow").style.display = '';
        document.getElementById("buffer").style.display = 'none';
      }
    }
    
  </script>

  <h3 style="text-align:center; margin-top:10px">${actor.data.name} Skill Roll</h3>
  <table style="width:100%">
    <tr>
      <th style="width:33%">
        <label>Character Rating</label>
      </th>
      <td style="width:33%">
        <select id="skillDropDown" onchange=SkillChanged(this)>
          <optgroup label="ATTRIBUTES">
            ${attributes.map(a => `<option value="${a.value}" ${a.name == initialSkill ? ' selected' : ''}>${a.name}</option>`).join(``)}
          </optgroup>
          <optgroup label="RESOURCES">
            ${resources.map(r => `<option value="${r.value}" ${r.name == initialSkill ? ' selected' : ''}>${r.name}</option>`).join(``)}
          </optgroup>
          <optgroup label="SKILLS">
            ${skills.map(s => `<option value="${s.value}" ${s.name == initialSkill ? ' selected' : ''}>${s.name}</option>`).join(``)}
          </optgroup>
        </select>
      </td>
      <td style="width:33%;border 1px solid black;padding:5px" id="skillBonus">${(initialSkillBonus >= 0 ? '+' : '') + initialSkillBonus}</td>
    </tr>
    <tr id="attributeBonusRow" style=${initialSkill.includes(['A']) ? "display:none" : "display:''"}>
      <th style="width:33%">
        <label id="attributeBonusLabel">Attribute Bonus</label>
      </th> 
      <td>
        <select id="attributeDropDown" onchange=AttributeBonusChanged(this)>
            <option value=''></option>
              ${attributes.map(a => `<option value="${GetAttributeBonus(a.value)}">${a.name}</option>`).join(``)}
        </select>
      </td>
      <td style="width:33%;border 1px solid black;padding:5px" id="attributeBonus"></td>
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
  <div id="buffer" style=${initialSkill.includes(['A']) ? "height:40px;display:''" : "display:none"}></div>
  `: '';

let d = new Dialog({
  title: 'WtC Skill Roll',
  content: skillsOptions ? dialogContent : errorContent,
  buttons: {
    roll: {
      icon: '<i class="fas fa-dice-d20"></i>',
      label: skillsOptions ? "Roll" : "Close",
      callback: () => skillsOptions ? roll() : close()
    }
  }
});
d.render(true);