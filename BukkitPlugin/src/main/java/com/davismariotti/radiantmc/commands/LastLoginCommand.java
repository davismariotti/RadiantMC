package com.davismariotti.radiantmc.commands;

import com.davismariotti.radiantmc.RadiantMCPlugin;
import com.google.inject.Inject;
import org.bukkit.ChatColor;
import org.bukkit.OfflinePlayer;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;

import java.text.SimpleDateFormat;
import java.util.*;
import org.jetbrains.annotations.NotNull;

public class LastLoginCommand implements CommandExecutor {

    @Inject
    RadiantMCPlugin plugin;

    private final SimpleDateFormat dateFormat = new SimpleDateFormat(String.format("M-d-YY '%sat%s' hh:mma  ", ChatColor.GOLD, ChatColor.RED));

    private static class LoginData {
        private final String name;
        private final Long loginTime;

        private LoginData(String name, Long loginTime) {
            this.name = name;
            this.loginTime = loginTime;
        }

        public String getName() {
            return name;
        }

        public Long getLoginTime() {
            return loginTime;
        }
    }

    @Override
    public boolean onCommand(@NotNull CommandSender commandSender, @NotNull Command command, @NotNull String s, @NotNull String[] strings) {
        List<LoginData> loginDataList = new ArrayList<>();
        for (OfflinePlayer offlinePlayer : plugin.getServer().getOfflinePlayers()) {
            loginDataList.add(new LoginData(offlinePlayer.getName(), offlinePlayer.getLastPlayed()));
        }
        loginDataList.sort(Comparator.comparing(LoginData::getLoginTime));
        for (LoginData loginData : loginDataList) {
            commandSender.sendMessage(ChatColor.RED + loginData.getName() + ChatColor.GOLD + " last logged in at " + ChatColor.RED + dateFormat.format(new Date(loginData.getLoginTime())));
        }

        return false;
    }
}
