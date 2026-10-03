/* @layer renderer-shell @kind component */
import { ConfirmIconButton, InlineCreateForm, ListItemRow } from '@drizztdourden08/tessera/composites';
import { Box, Flex, Icon, IconButton } from '@drizztdourden08/tessera/primitives';
import { PROFILES_PANEL_TEXT } from '../ProfilesPanel.constants';
import type { ProfilesPanelRowProps } from './ProfilesPanelRow.type';

const ProfilesPanelRow = (props: ProfilesPanelRowProps) => {
  const { profile, selected, renaming, renameError, onSelect, onDelete, onStartRename, onSubmitRename, onCancelRename } = props;
  const { id, name, meta, aside, icon } = profile;

  if (renaming) {
    return (
      <Box role="listitem" className="profiles-panel__rename">
        <InlineCreateForm
          compact
          size="sm"
          label={PROFILES_PANEL_TEXT.rename(name)}
          defaultValue={name}
          submitLabel={PROFILES_PANEL_TEXT.renameSubmit}
          onCreate={(next) => onSubmitRename(id, next)}
          onCancel={onCancelRename}
          error={renameError}
        />
      </Box>
    );
  }

  const actions = onStartRename !== undefined || onDelete !== undefined ? (
    <Flex gap="xs" align="center">
      {onStartRename && (
        <IconButton variant="ghost" size="sm" label={PROFILES_PANEL_TEXT.rename(name)} title={PROFILES_PANEL_TEXT.rename(name)} onClick={() => onStartRename(id)}>
          <Icon name="pencil" size={14} />
        </IconButton>
      )}
      {onDelete && (
        <ConfirmIconButton
          icon={<Icon name="trash-2" size={14} />}
          label={PROFILES_PANEL_TEXT.remove(name)}
          confirmLabel={PROFILES_PANEL_TEXT.remove(name)}
          cancelLabel={PROFILES_PANEL_TEXT.keep}
          onConfirm={() => onDelete(id)}
          placement="end"
        />
      )}
    </Flex>
  ) : undefined;

  return (
    <ListItemRow
      role="listitem"
      name={name}
      meta={meta}
      aside={aside}
      icon={icon}
      selected={selected}
      onClick={() => onSelect(id)}
      action={actions}
      actionVisibility="always"
    />
  );
};

export { ProfilesPanelRow };
