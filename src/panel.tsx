import {
  DialogButton,
  Field,
  Focusable,
  PanelSection,
  Router,
} from "@decky/ui";
import { useState, VFC } from "react";
import { FaCog, FaPlus, FaTimesCircle } from "react-icons/fa";
import { call } from "@decky/api";
import { IconDialogButton } from "./common/components";

// interface AddMethodArgs {
//   left: number;
//   right: number;
// }

interface TerminalResult {
  id: string;
  pid?: number;
  exitcode?: number;
  is_started: boolean;
  is_completed: boolean;
  title?: string;
}

const SidePanel: VFC = ({}) => {
  // 

  // const onClick = async () => {
  //   const result = await serverAPI.callPluginMethod<AddMethodArgs, number>(
  //     "add",
  //     {
  //       left: 2,
  //       right: 2,
  //     }
  //   );
  //   if (result.success) {
  //     setResult(result.result);
  //   }
  // };

  const [result, setResult] = useState<TerminalResult[]>([]);

  const getTerminals = async () => {
    const result = await call<[], TerminalResult[]>("get_terminals");
    setResult(result);
  }

  const createTerminal = async () => {
    const result = await call<[], boolean>("create_terminal");
    if (result) {
      await getTerminals();
    }
  }

  const removeTerminal = async (terminal_id: string) => {
    const result = await call<[terminal_id: string], boolean>("remove_terminal", terminal_id);
    if (result) {
      await getTerminals();
    }
  }

  useState(() => {
    getTerminals()
  });

  return <div style={{ boxSizing: 'border-box', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <Field childrenLayout="inline" childrenContainerWidth="max" highlightOnFocus={false} bottomSeparator="none">
      <Focusable style={{ marginRight: '.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <DialogButton onClick={createTerminal}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem'}}>
            <FaPlus />
            <span>Add Terminal</span>
          </div>
        </DialogButton>
        <IconDialogButton onClick={() => {
          Router.CloseSideMenus();
          Router.Navigate("/decky-terminal/settings");
        }}>
          <FaCog />
        </IconDialogButton>
      </Focusable>
    </Field>
    <PanelSection title="Active Terminals">
      {
        result.map((terminal) => 
          <Field childrenLayout="inline" childrenContainerWidth="max">
            <Focusable style={{ width: 'calc(100% - .5rem)', display: 'flex', alignItems: 'stretch', justifyContent: 'center', gap: '1rem' }}>
              <DialogButton
                onClick={() => {
                  Router.CloseSideMenus();
                  Router.Navigate("/terminals/"+terminal.id);
                }}
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: 0,
                  flexGrow: 1,
                }}
              >
                { terminal.title ?? terminal.id }
              </DialogButton>

              <IconDialogButton
                onClick={() => {
                  removeTerminal(terminal.id)
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '5px',
                  minWidth: 'auto',
                }}
              >
                <FaTimesCircle />
              </IconDialogButton>
            </Focusable>
          </Field>
        )
      }
    </PanelSection>
  </div>;
};

export default SidePanel;