/** Simple dialog to roll Fudge dice with 3 categories of bonuses for Wearing the Cape
  * Adapted from the Animated Objects attack/damage macro by HoneyBadger
*/

/*quickDialog
    Send an array of data to build a Vertical Input Dialog of Multiple Types
    returns a promise (value is an Array of the chosen values)
  data = [{}]
  {} = {
    type : `type of input`, //text, password, radio, checkbox, number, select
    label : `Whatever you want to be listed`,
    options : [``] or ``
  }
*/

async function quickDialog({ data, title = `Quick Dialog`, instructions } = {}) {
  data = data instanceof Array ? data : [data];

  return await new Promise((resolve) => {
    let content = `
    <p>${instructions || ''}<p>
    <table style="width:100%">
      ${data.map(({ type, label, options, selected }, i) => {
      if (type.toLowerCase() === `select`) {
        return `<tr><th style="width:50%"><label>${label}</label></th><td style="width:50%"><select id="${i}qd">${options.map(e => `<option value="${getOptionValue(e)}" ${getOptionName(e) === selected ? ' selected' : ''}>${getOptionName(e)}</option>`).join(``)}</td></tr>`;
      } else if (type.toLowerCase() === `checkbox`) {
        return `<tr><th style="width:50%"><label>${label}</label></th><td style="width:50%"><input type="${type}" id="${i}qd" ${options || ``}/></td></tr>`;
      } else {
        return `<tr><th style="width:50%"><label>${label}</label></th><td style="width:50%"><input type="${type}" id="${i}qd" value="${options instanceof Array ? options[2] : options}"/></td></tr>`;
      }
    }).join(``)}
    </table>`;

    new Dialog({
      title, content,
      buttons: {
        Ok: {
          label: `Let's Roll!`, callback: (html) => {
            resolve(Array(data.length).fill().map((e, i) => {
              let { type } = data[i];
              switch (type.toLowerCase()) {
                case 'select':
                  return html.find(`select#${i}qd`).val();
                case `text`:
                case `password`:
                case `radio`:
                  return html.find(`input#${i}qd`)[0].value;
                case `checkbox`:
                  return html.find(`input#${i}qd`)[0].checked;
                case `number`:
                  return html.find(`input#${i}qd`)[0].valueAsNumber;
              }
            }));
          }
        }
      }
    }).render(true);
  });
}

function populateSkillsOptions() {
  return actor.data.items
  .filter(item => item.type === "skill")
  .map(function(element) { 
        return { name: element.name, value: element.data.rank };
    });
}

function getOptionName(skill)
{
  return typeof skill === 'object' ? skill.name : skill;
}

function getOptionValue(skill)
{
  return typeof skill === 'object' ? skill.value : skill;
}

(async () => {
  let attackdata = [
    { type: `select`, label: `Skill : `, options: populateSkillsOptions(), selected: "Fight[S]" },
    { type: `select`, label: `Attribute Bonus : `, options: [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], selected: 0 },
    { type: `select`, label: `Other Modifiers : `, options: [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], selected: 0 }
  ];

  const [skill, attr, mod] = await quickDialog({ data: attackdata, title: `WtC Skill Roll`, instructions: 'Enter the numbers for your skill, attribute and bonuses' });

  let roll = new Roll(`4df+${skill}+${attr}+${mod}`).roll()
  await roll.toMessage({ flavor: `4df Skill Roll - click to see the dice` });
})();