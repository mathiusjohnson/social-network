import React from "react";
import { Link } from "gatsby";
import styled, { DefaultTheme } from "styled-components";
import { LayoutHeader } from "@paljs/ui/Layout";
import { EvaIcon } from "@paljs/ui/Icon";
import { Actions } from "@paljs/ui/Actions";
import { breakpointDown } from "@paljs/ui/breakpoints";
import LoginLogout from "../components/LoginLogout/LoginLogout";
import ProgressBar from "../components/ProgressBar/ProgressBar";
import ContextConsumer from "../context/context";
import './Header.scss'
const HeaderStyle = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  ${breakpointDown("sm")`
    .right{
      display: none;
    }
  `}
  .right > div {
    height: auto;
    display: flex;
    align-content: center;
  }
  .logo {
    font-size: 1.25rem;
    white-space: nowrap;
    text-decoration: none;
  }
`;

const Label = styled.span`
  display: flex;
  align-items: center;
`;

const experience = ("header__item-experience")
const title = ("header__item-title")

interface HeaderProps {
  toggleSidebar: () => void;
  changeTheme: (value: DefaultTheme["name"]) => void;
  changeDir: () => void;
  dir: "rtl" | "ltr";
}

const Header: React.FC<HeaderProps> = (props) => {
  const themeOptions = [
    {
      value: "default",
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: "#a6c1ff" }} />
          Default
        </Label>
      ),
    },
    {
      value: "dark",
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: "#192038" }} />
          Dark
        </Label>
      ),
    },
    {
      value: "cosmic",
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: "#5a37b8" }} />
          Cosmic
        </Label>
      ),
    },
    {
      value: "corporate",
      label: (
        <Label>
          <EvaIcon name="droplet" options={{ fill: "#3366ff" }} />
          Corporate
        </Label>
      ),
      selected: true,
    },
  ];
  return (
    <LayoutHeader fixed>
      <HeaderStyle>
        <Actions
          size="Medium"
          actions={[
            {
              icon: { name: "menu-2-outline" },
              url: {
                onClick: props.toggleSidebar,
              },
            },
            {
              content: (
                <Link to="/" className="logo">
                  STACK
                </Link>
              ),
            },
          ]}
        />
        <Actions
          size="Small"
          actions={[
            {
              content: (
                <ContextConsumer>
                    {({ data }) => {
                      if (!data.state) return null;
                      if (!data.selected) return null;
                      let user;
                      const currentUser = data.state.users.find(
                        (user) => user.id === data.selected
                      );

                      if (currentUser) {
                        user = currentUser;
                      }
                        return (
                          <div className={title}>
                            <span>         
                                {user.mentorrating ? 
                                  <span>
                                   Mentor Lvl:
                                  </span>
                                : ""}
                            </span>       
                          </div>
                        )
                      
                    }}
                </ContextConsumer>
              ),
            },
          ]}
        />
        <Actions
          size="Small"
          actions={[
            {
              content: (
                <ContextConsumer>
                    {({ data }) => {
                      if (!data.state) return null;
                      if (!data.selected) return null;
                      const user = data.state.users.find(
                        (user) => user.id === data.selected
                      );
                      return (
                        <div className={experience}>
                          <span>         
                              {user.mentorrating ? 
                                <span>
                                  <ProgressBar 
                                    experience={Number(user.mentorrating)}
                                  />
                                </span>
                              : ""}
                          </span>       
                        </div>
                      )
                    }}
                </ContextConsumer>
              ),
            },
          ]}
        />
        <Actions
          size="Small"
          actions={[
            {
              content: (
                <ContextConsumer>
                    {({ data }) => {
                      if (!data.state) return null;
                      if (!data.selected) return null;
                      const user = data.state.users.find(
                        (user) => user.id === data.selected
                      );
                      return (
                        <div className={title}>
                          <span>         
                              {user.studentrating ? 
                                <span>
                                  Student Lvl:
                                </span>
                            : ""}
                        </span>
                      </div>
                    )
                  }}
                </ContextConsumer>
              ),
            },
          ]}
        />
        <Actions
          size="Small"
          actions={[
            {
              content: (
                <ContextConsumer>
                    {({ data }) => {
                      if (!data.state) return null;
                      if (!data.selected) return null;
                      const user = data.state.users.find(
                        (user) => user.id === data.selected
                      );
                      return (
                        <div className={experience}>
                          <span>         
                              {user.studentrating ? 
                                <span>
                                  <ProgressBar
                                    experience={Number(user.studentrating)}
                                  />
                                </span>
                              : ""}
                          </span>       
                        </div>
                      )
                    }}
                </ContextConsumer>
              ),
            },
          ]}
        />
        <Actions
          size="Small"
          className="right"
          actions={[
            {
              content: (
                <LoginLogout />
              ),
            },
          ]}
        />
      </HeaderStyle>
    </LayoutHeader>
  );
};
export default Header;
