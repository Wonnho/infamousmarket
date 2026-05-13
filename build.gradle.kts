plugins {
    id("java")
    id("war")
}

group = "org.infamousmarket"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation(platform("org.springframework:spring-framework-bom:5.3.31"))

    implementation("org.springframework:spring-context")
    implementation("org.springframework:spring-webmvc")

    // Tomcat 9 provides this at runtime
    compileOnly("javax.servlet:javax.servlet-api:4.0.1")

    // Optional if using JSP/JSTL
    implementation("javax.servlet:jstl:1.2")

    testImplementation(platform("org.junit:junit-bom:5.10.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")
}

tasks.test {
    useJUnitPlatform()
}