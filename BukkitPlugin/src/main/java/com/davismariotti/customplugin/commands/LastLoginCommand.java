package com.davismariotti.customplugin.commands;

import com.davismariotti.customplugin.CustomPlugin;
import org.bukkit.ChatColor;
import org.bukkit.OfflinePlayer;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;

import java.text.SimpleDateFormat;
import java.util.*;

public class LastLoginCommand implements CommandExecutor {

    private SimpleDateFormat dateFormat = new SimpleDateFormat(String.format("M-d-YY '%sat%s' hh:mma  ", ChatColor.GOLD, ChatColor.RED));

    private static class LoginData {
        private String name;
        private Long loginTime;

        private LoginData(String name, Long loginTime) {
            this.name = name;
            this.loginTime = loginTime;
        }

        public Long getLoginTime() {
            return loginTime;
        }

        public String getName() {
            return name;
        }
    }

    @Override
    public boolean onCommand(CommandSender commandSender, Command command, String s, String[] strings) {
        List<LoginData> loginDataList = new ArrayList<>();
        for (OfflinePlayer offlinePlayer : CustomPlugin.instance.getServer().getOfflinePlayers()) {
            loginDataList.add(new LoginData(offlinePlayer.getName(), offlinePlayer.getLastPlayed()));
        }
        loginDataList.sort(Comparator.comparing(LoginData::getLoginTime));
        for (LoginData loginData : loginDataList) {
            commandSender.sendMessage(ChatColor.RED + loginData.getName() + ChatColor.GOLD + " last logged in at " + ChatColor.RED + dateFormat.format(new Date(loginData.getLoginTime())));
        }

        return false;
    }
}
