/** Simple dialog to roll Fudge dice with 3 categories of bonuses for Wearing the Cape
  * Used Animated Objects attack/damage macro by HoneyBadger as a reference
*/

// Skill initially selected in drop down 
let initiallySelectedSkill = 'Fight[S]';

// Skills to be excluded in the drop down
let excludedSkills = ['[ATTRIBUTES]', '[SKILLS]', '[RESOURCES]']

// Attribute and Resource Names. Everything not in these two lists will be classified as a Skill
let attributeNames = ['Alertness[A]', 'Athleticism[A]', 'Discernment[A]', 'Physique[A]', 'Presence[A]', 'Willpower[A]'];
let resourceNames = ['Contacts[R]', 'Reputation[R]', 'Wealth[R]'];

let allItems = getallItems();
let initiallySelectedSkillBonus = allItems?.find(s => s.name == initiallySelectedSkill)?.value;

let attributes = allItems?.filter(item => attributeNames.includes(item.name)).sort((a, b) => (a.name > b.name) ? 1 : -1); 
let resources = allItems?.filter(item => resourceNames.includes(item.name)).sort((a, b) => (a.name > b.name) ? 1 : -1);
let skills = allItems?.filter(item => isSkill(item.name)).sort((a, b) => (a.name > b.name) ? 1 : -1);

// Get all items from the selected player token
function getallItems() {
  if (!actor?.data?.items) {
    return null;
  }
  return actor.data.items
    .filter(item => item.type === 'skill' && !excludedSkills.includes(item.name))
    .map(function (element) {
      return { name: element.name, value: element.data.rank }
    });
}

function isSkill(name) {
  return (attributeNames.includes(name) || resourceNames.includes(name)) ? false : true;
}

function roll() {
  let skill = document.getElementById("skillDropDown");
  let attributeBonus = document.getElementById("attributeDropDown")
  let aspectBonus = document.getElementById("aspectBonus").value;
  let circumstanceModifier = document.getElementById("circumstanceModifier").value;
  console.log(`4df + ${skill.options[skill.selectedIndex].text}(${skill.value ? skill.value : 0}) ${attributeBonus.value ? (' + ' + attributeBonus.options[attributeBonus.selectedIndex].text + '(' + attributeBonus.value + ')') : ''} + Aspect Bonus(${aspectBonus ? aspectBonus : 0}) + Circumstance Modifier(${circumstanceModifier ? circumstanceModifier : 0})`);
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
let dialogContent = allItems ? `
  <script>
    function SkillChanged(selectedSkill) {
      document.getElementById("skillBonus").innerHTML = (selectedSkill.value >= 0? '+': '') + selectedSkill.value;
      ShowHideAttributeBonus();
    }
    function AttributeBonusChanged(attributeBonus) {
      document.getElementById("attributeBonus").innerHTML = (attributeBonus.value && attributeBonus.value >= 0? '+': '') + attributeBonus.value;
    }
    function ShowHideAttributeBonus() {
      let skill = document.getElementById("skillDropDown");
      let skillName = skill.options[skill.selectedIndex].text
      let selectedOptGroup = document.querySelector('#skillDropDown option:checked').parentElement.label;
      
      // Only display the AttributeBonus drop down if the selected skill is neither an attribute nor a resource
      // Show a Buffer at the bottom of the window when the AttributeBonus is hidden, so the dialog remains roughly the same size
      if (selectedOptGroup == 'ATTRIBUTES' || selectedOptGroup == 'RESOURCES')
      {
        document.getElementById("attributeBonusRow").style.display = 'none';
        let attributeBonus = document.getElementById("attributeDropDown").value = '';
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
            ${attributes.map(a => `<option value="${a.value}" ${a.name == initiallySelectedSkill ? ' selected' : ''}>${a.name}</option>`).join(``)}
          </optgroup>
          <optgroup label="RESOURCES">
            ${resources.map(r => `<option value="${r.value}" ${r.name == initiallySelectedSkill ? ' selected' : ''}>${r.name}</option>`).join(``)}
          </optgroup>
          <optgroup label="SKILLS">
            ${skills.map(s => `<option value="${s.value}" ${s.name == initiallySelectedSkill ? ' selected' : ''}>${s.name}</option>`).join(``)}
          </optgroup>
        </select>
      </td>
      <td style="width:33%;border 1px solid black;padding:5px" id="skillBonus">${(initiallySelectedSkillBonus >= 0 ? '+' : '') + initiallySelectedSkillBonus}</td>
    </tr>
    <tr id="attributeBonusRow" style=${isSkill(initiallySelectedSkill) ? "display:'' ": "display:none"}>
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
      <input type="number" id="aspectBonus" \>
      </td>
    </tr>
    <tr>
      <th style="width:33%">
        <label>Circumstance Modifier</label>
      </th> 
      <td style="width:33%">
        <input type="number" id="circumstanceModifier" \>
      </td>
    </tr>
  </table>
  <div id="buffer" style=${isSkill(initiallySelectedSkill) ? "display:none" : "height:40px;display:''"}></div>
  `: '';

let d = new Dialog({
  title: 'WtC Skill Roll',
  content: allItems ? dialogContent : errorContent,
  buttons: {
    roll: {
      icon: '<i class="fas fa-dice-d20"></i>',
      label: allItems ? "Roll" : "Close",
      callback: () => allItems ? roll() : close()
    }
  }
});
d.render(true);