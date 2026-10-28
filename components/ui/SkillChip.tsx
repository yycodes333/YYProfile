import { tierLabels, type OrbitSkill } from '@/lib/content/skills';

type SkillChipProps = {
  skill: OrbitSkill;
};

/** 轨道上的技能卡片：名称 + 真实梯度角标 + 一句场景。 */
export function SkillChip({ skill }: SkillChipProps) {
  return (
    <div className="skill-chip" data-tier={skill.tier}>
      <div className="skill-chip-head">
        <span className="skill-chip-name">{skill.name}</span>
        <span className="skill-chip-tier">{tierLabels[skill.tier]}</span>
      </div>
      <p className="skill-chip-note">{skill.note}</p>
    </div>
  );
}
