import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

interface ListItemProps {
  color: string;
  avatarContent: React.ReactNode;
  name: string;
  sub: string;
  rightTop: React.ReactNode;
  rightBottom?: React.ReactNode;
  onClick?: () => void;
  badge?: { text: string; color: string };
  disabled?: boolean;
  style?: ViewStyle;
}

export function ListItem({
  color,
  avatarContent,
  name,
  sub,
  rightTop,
  rightBottom,
  onClick,
  badge,
  disabled = false,
  style,
}: ListItemProps) {
  const Content = () => (
    <>
      <View style={[styles.avatar, { backgroundColor: color + "22" }]}>
        <Text style={[styles.avatarText, { color }]}>{avatarContent}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.nameContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {badge && (
            <View
              style={[styles.badge, { backgroundColor: badge.color + "22" }]}
            >
              <Text style={[styles.badgeText, { color: badge.color }]}>
                {badge.text}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.sub} numberOfLines={1}>
          {sub}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.rightTop}>{rightTop}</View>
        {rightBottom && <View style={styles.rightBottom}>{rightBottom}</View>}
      </View>
    </>
  );

  if (onClick && !disabled) {
    return (
      <TouchableOpacity
        onPress={onClick}
        style={[styles.container, style]}
        activeOpacity={0.7}
      >
        <Content />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Content />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    flexShrink: 1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "600",
  },
  sub: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  rightSection: {
    alignItems: "flex-end",
    marginLeft: 12,
  },
  rightTop: {
    marginBottom: 4,
  },
  rightBottom: {},
});
