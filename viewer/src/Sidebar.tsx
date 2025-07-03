import styled from "styled-components";

export const Sidebar = styled.aside`
  width: 480px;
  background: #f7f7fa;
  border-right: 1px solid #e0e0e0;
  padding: 24px 16px;
  height: 100vh;
  overflow-y: auto;
  text-align: left;
`;

export const SidebarTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

export const WorkflowList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
`;

export const WorkflowItem = styled.li`
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

export const StepList = styled.ul`
  list-style: none;
  padding-left: 2rem;
  margin: 0;
`;

export const StepItem = styled.li`
  margin-bottom: 0.3rem;
  font-weight: normal;
  color: #444;
`;
