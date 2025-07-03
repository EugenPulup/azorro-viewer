import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Sidebar,
  SidebarTitle,
  WorkflowList,
  WorkflowItem,
  StepList,
  StepItem,
} from "./Sidebar";

import "./App.css";

interface Step {
  stepId: string;
  description?: string;
  operationId: string;
  onFailure?: { name: string; type: string }[];
}

interface Workflow {
  workflowId: string;
  summary?: string;
  steps: Step[];
}

type Source = {
  [x: string]: {
    [x: string]: object;
  };
};

interface Spec {
  workflows: Workflow[];
  components?: {
    inputs?: Record<string, JSON>;
    parameters?: Record<string, { name: string; in?: string; value: unknown }>;
    successActions?: Record<
      string,
      { name: string; type: string; workflowId?: string; stepId?: string }
    >;
    failureActions?: Record<
      string,
      {
        name: string;
        type: string;
        workflowId?: string;
        stepId?: string;
        retryAfter?: number;
        retryLimit?: number;
      }
    >;
  };
}

const Main = styled.main`
  width: 100%;
  display: flex;
`;

const MainList = styled.main`
  padding: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const StepBlock = styled.li`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
`;

function App() {
  const [spec, setSpec] = useState<Spec | null>(null);
  const [sources, setSources] = useState<Sources | null>(null);

  useEffect(() => {
    fetch("/spec.json")
      .then((res) => res.json())
      .then((data) => setSpec(data));
  }, []);

  useEffect(() => {
    fetch("/spec.sources.json")
      .then((res) => res.json())
      .then((data) => setSources(data));
  }, []);

  return (
    <>
      <Main>
        <Sidebar>
          <SidebarTitle>Workflows</SidebarTitle>
          <WorkflowList>
            {spec?.workflows?.map((wf) => (
              <WorkflowItem key={wf.workflowId}>
                {wf.summary || wf.workflowId}
                <StepList>
                  {wf.steps?.map((step) => (
                    <StepItem key={step.stepId}>
                      {step.stepId
                        ? `- ${step.stepId}  ${
                            getSourceDescription(step.operationId, sources)
                              .method
                          }`
                        : ""}
                    </StepItem>
                  ))}
                </StepList>
              </WorkflowItem>
            ))}
          </WorkflowList>
        </Sidebar>
        <MainList>
          {spec?.workflows?.map((wf) => (
            <section key={wf.workflowId}>
              <h2>{wf.workflowId}</h2>
              {wf.summary && <p>{wf.summary}</p>}

              <ul>
                {wf.steps?.map((step) => (
                  <StepBlock key={step.stepId}>
                    <strong>Step ID: {step.stepId}</strong>
                    {step.operationId && (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span>
                          {" "}
                          Path:{" "}
                          {getSourceDescription(step.operationId, sources).path}
                        </span>
                        <span>
                          {" "}
                          Method:{" "}
                          {
                            getSourceDescription(step.operationId, sources)
                              .method
                          }
                        </span>
                      </div>
                    )}
                    {step.onFailure && (
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <strong>On Failure:</strong>
                        <span style={{ marginLeft: "1rem" }}>
                          Name:{" "}
                          {
                            resolveArazzoReference(step.onFailure[0], spec)
                              ?.name
                          }
                        </span>
                        <span style={{ marginLeft: "1rem" }}>
                          Type:{" "}
                          {
                            resolveArazzoReference(step.onFailure[0], spec)
                              ?.type
                          }
                        </span>
                      </div>
                    )}
                  </StepBlock>
                ))}
              </ul>
            </section>
          ))}
        </MainList>
      </Main>
    </>
  );
}

function resolveArazzoReference(
  refObj: Record<string, unknown> | null,
  spec: Spec | null
): object | undefined {
  if (!spec || !refObj || typeof refObj !== "object") return undefined;

  const ref = refObj.reference;

  if (!ref || typeof ref !== "string") {
    return undefined;
  }

  const [, section, key] = ref.split(".");

  if (!section || !key) return undefined;

  return spec.components[section]?.[key] || undefined;
}

function getSourceDescription(
  operationId: string,
  sources: Record<string, { paths: object[] }> | null
): object | undefined {
  if (!sources) return undefined;

  const [, sourceName, operationName] = operationId.split(".");

  return sources[sourceName][operationName];
}

export default App;
