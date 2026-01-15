import React from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

interface PDFReportProps {
    report: {
        title: string;
        num_rows: number;
        columns: string[];
        uploaded_at: string;
    };
    summary: {
        summary: string;
        metrics: string[];
        trends: string[];
        recommendations: string[];
    };
}

const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontSize: 11,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff',
    },
    header: {
        marginBottom: 30,
        paddingBottom: 20,
        borderBottomWidth: 3,
        borderBottomStyle: 'solid',
        borderBottomColor: '#000000',
    },
    logo: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#000000',
    },
    reportTitle: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 4,
    },
    metadata: {
        fontSize: 9,
        color: '#6B7280',
    },
    section: {
        marginTop: 25,
        marginBottom: 15,
    },
    sectionHeader: {
        backgroundColor: '#F3F4F6',
        padding: 12,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftStyle: 'solid',
        borderLeftColor: '#000000',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    sectionIcon: {
        fontSize: 14,
        marginBottom: 2,
        color: '#6B7280',
    },
    text: {
        lineHeight: 1.6,
        marginBottom: 10,
        color: '#374151',
    },
    bulletList: {
        marginTop: 8,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingLeft: 5,
    },
    bullet: {
        width: 20,
        fontSize: 16,
        color: '#6B7280',
        marginRight: 5,
    },
    bulletText: {
        flex: 1,
        lineHeight: 1.5,
        color: '#374151',
    },
    metricGrid: {
        marginTop: 10,
    },
    metricBox: {
        backgroundColor: '#F9FAFB',
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#E5E7EB',
        borderRadius: 4,
    },
    metricText: {
        fontSize: 11,
        color: '#1F2937',
        lineHeight: 1.4,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 50,
        right: 50,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopStyle: 'solid',
        borderTopColor: '#E5E7EB',
    },
    footerText: {
        fontSize: 9,
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: 3,
    },
    pageNumber: {
        position: 'absolute',
        bottom: 20,
        right: 50,
        fontSize: 9,
        color: '#9CA3AF',
    },
  });

const PDFReport: React.FC<PDFReportProps> = ({ report, summary }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.logo}>ReportBrief</Text>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.metadata}>
                    Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Text>
                <Text style={styles.metadata}>
                    Uploaded: {new Date(report.uploaded_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Text>
            </View>
            
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionIcon}>Executive Summary</Text>
                </View>
                <Text style={styles.text}>{summary.summary}</Text>
            </View>
            
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionIcon}>Key Metrics</Text>
                </View>
                <View style={styles.metricGrid}>
          
                {summary.metrics.map((metric, idx) => (
                    <View key={idx} style={styles.metricBox}>
                        <Text style={styles.metricText}>{metric}</Text>
                    </View>
                ))}

                </View>
            </View>
            
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionIcon}>Notable Trends</Text>
                </View>
                <View style={styles.bulletList}>
          
                {summary.trends.map((trend, idx) => (
                    <View key={idx} style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>{trend}</Text>
                    </View>
                ))}

                </View>
            </View>
            
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionIcon}>Actionable Recommendations</Text>
                </View>
                <View style={styles.bulletList}>
          
                {summary.recommendations.map((rec, idx) => (
                    <View key={idx} style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>{rec}</Text>
                    </View>
                ))}

                </View>
            </View>
            
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Generated by ReportBrief | AI-Powered Report Analysis
                </Text>
                <Text style={styles.footerText}>
                    This summary is AI-generated. Please verify critical information before making business decisions.
                </Text>
            </View>
            
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                `Page ${pageNumber} of ${totalPages}`
                )} fixed
            />
        </Page>
    </Document>
);

// function to generate and download PDF
export const downloadPDF = async (report: PDFReportProps['report'], summary: PDFReportProps['summary']) => {
    const blob = await pdf(<PDFReport report={report} summary={summary} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${report.title.replace(/[^a-z0-9]/gi, '_')}_summary.pdf`;
    link.click();
    
    URL.revokeObjectURL(url);
};

export default PDFReport;